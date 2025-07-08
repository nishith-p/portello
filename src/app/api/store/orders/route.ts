import { NextRequest, NextResponse } from 'next/server';
import { isAdmin, withAuth } from '@/lib/auth/utils';
import { errorResponse, ValidationError } from '@/lib/core/errors';
import { createOrder, getOrders } from '@/lib/store/orders/db';
import { validateOrder } from '@/lib/store/orders/validators';
import { processCreditPayment, updateUserCredit } from '@/lib/wallet/db';
import {
  CreateOrderInputExtended,
  CreateOrderItemInput,
  CreateOrderPackItem,
  Order,
  isOptionalItem
} from '@/lib/store/types';

/**
 * GET /api/store/orders
 * Get all orders (admin only)
 */
export async function GET(request: NextRequest) {
  return withAuth(
    request,
    async () => {
      try {
        const orders = await getOrders();
        return NextResponse.json(orders);
      } catch (error) {
        return errorResponse(error as Error);
      }
    },
    {
      requireAuth: true,
      requireAdmin: true,
    }
  );
}

/**
 * POST /api/store/orders
 * Create a new order
 */
export async function POST(request: NextRequest) {
  return withAuth(
    request,
    async (_req, user) => {
      try {
        if (!user || !user.id) {
          throw new ValidationError('User is required', { user: 'User ID is required' });
        }

        // Parse request body
        let body: { 
          items: unknown[]; 
          total_amount?: number;
          credit_amount?: number;
          user_id?: string; 
          notes?: string;
          payment_method?: 'unpaid' | 'admin_paid' | 'credit_only';
          exchange_amount?: number;
          exchange_cash_amount?: number;
          exchange_credit_amount?: number;
        } | unknown[];
        
        try {
          body = await request.json();
        } catch (e) {
          throw new ValidationError('Invalid JSON in request body');
        }

        // Handle the case where body could be an array (just items) or an object with items property
        const orderItems = Array.isArray(body) ? body : body.items;
        
        // For admin users, allow specifying a different user_id (for custom orders)
        let targetUserId = user.id;
        
        if (!Array.isArray(body) && body.user_id && body.user_id !== user.id) {
          const userIsAdmin = await isAdmin();
          if (userIsAdmin) {
            targetUserId = body.user_id;
          } else {
            throw new ValidationError('Only admins can create orders for other users');
          }
        }

        // Calculate total amount
        const totalAmount = Array.isArray(body)
          ? orderItems.reduce<number>((sum, item) => {
              if (
                typeof item === 'object' &&
                item !== null &&
                'price' in item &&
                'quantity' in item &&
                typeof item.price === 'number' &&
                typeof item.quantity === 'number'
              ) {
                return sum + item.price * item.quantity;
              }
              return sum;
            }, 0)
          : parseFloat(String(body.total_amount));

        if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
          throw new ValidationError('Order must contain at least one item', {
            items: 'Items array is required',
          });
        }

        // Get payment details from request
        const paymentMethod = !Array.isArray(body) ? body.payment_method : undefined;
        const creditAmount = !Array.isArray(body) ? body.credit_amount : undefined;
        const exchangeCreditAmount = !Array.isArray(body) ? body.exchange_credit_amount : undefined;

        // Validate credit payment amount if payment method is credit_only
        if (paymentMethod === 'credit_only' && (typeof creditAmount !== 'number' || creditAmount <= 0)) {
          throw new ValidationError('Valid credit amount is required for credit payments');
        }

        // Process items
        const typedItems: (CreateOrderItemInput | CreateOrderPackItem)[] = [];
        for (const item of orderItems) {
          if (typeof item === 'object' && item !== null) {
            if ('is_pack' in item && item.is_pack === true) {
              // Pack item processing
              if (
                'item_code' in item &&
                'quantity' in item &&
                'price' in item &&
                'pack_items' in item
              ) {
                const packItem: CreateOrderPackItem = {
                  item_code: String(item.item_code),
                  quantity: Number(item.quantity),
                  price: Number(item.price),
                  pre_price: 'pre_price' in item ? Number(item.pre_price) : 0,
                  discount_perc: 'discount_perc' in item ? Number(item.discount_perc) : 0,
                  name: 'name' in item ? String(item.name) : null,
                  image: 'image' in item ? String(item.image) : null,
                  is_pack: true,
                  pack_items: Array.isArray(item.pack_items)
                    ? item.pack_items.map((child: unknown) => {
                        // Fix: Properly handle child object
                        if (typeof child !== 'object' || child === null) {
                          return {
                            item_code: '',
                            quantity: 1,
                            price: 0,
                          };
                        }

                        // Now safely cast to Record<string, unknown>
                        const childObj = child as Record<string, unknown>;

                        return {
                          item_code: 'item_code' in childObj ? String(childObj.item_code) : '',
                          quantity: 'quantity' in childObj ? Number(childObj.quantity) : 1,
                          price: 'price' in childObj ? Number(childObj.price || 0) : 0,
                          size: 'size' in childObj ? String(childObj.size) : null,
                          color: 'color' in childObj ? String(childObj.color) : null,
                          color_hex: 'color_hex' in childObj ? String(childObj.color_hex) : null,
                          name: 'name' in childObj ? String(childObj.name) : null,
                          image: 'image' in childObj ? String(childObj.image) : null,
                        };
                      })
                    : [],
                };
                typedItems.push(packItem);
              }
            } else {
              // Regular item processing
              if ('item_code' in item && 'quantity' in item && 'price' in item) {
                const regularItem: CreateOrderItemInput = {
                  item_code: String(item.item_code),
                  quantity: Number(item.quantity),
                  price: Number(item.price),
                  pre_price: 'pre_price' in item ? Number(item.pre_price) : 0,
                  discount_perc: 'discount_perc' in item ? Number(item.discount_perc) : 0,
                  size: 'size' in item ? String(item.size) : null,
                  color: 'color' in item ? String(item.color) : null,
                  color_hex: 'color_hex' in item ? String(item.color_hex) : null,
                  name: 'name' in item ? String(item.name) : null,
                  image: 'image' in item ? String(item.image) : null,
                };
                typedItems.push(regularItem);
              }
            }
          }
        }

        // Determine initial status
        let initialStatus: 'pending' | 'paid' | 'paid with credit' = 'pending';
        if (paymentMethod === 'admin_paid') {
          initialStatus = 'paid';
        } else if (paymentMethod === 'credit_only') {
          initialStatus = 'paid with credit';
        }

        // Prepare service data
        const serviceData: CreateOrderInputExtended = {
          user_id: targetUserId,
          status: initialStatus,
          total_amount: totalAmount,
          items: typedItems,
        };

        // Validate order data
        validateOrder(serviceData as unknown as Order);

        // Create the order
        const newOrder = await createOrder(serviceData);
        
        // Handle credit payment - KEY FIX: Use creditAmount instead of totalAmount
        if (paymentMethod === 'credit_only' && creditAmount) {
          const creditResult = await processCreditPayment(
            targetUserId, 
            newOrder.id, 
            creditAmount // Use the credit amount sent from frontend
          );
          if (!creditResult.success) {
            throw new ValidationError(creditResult.error || 'Credit payment failed');
          }
        }
        
        // Handle exchange if admin paid and provided exchange amount
        if (paymentMethod === 'admin_paid' && exchangeCreditAmount && exchangeCreditAmount > 0) {
          const exchangeResult = await updateUserCredit(
            targetUserId,
            exchangeCreditAmount,
            `Exchange from admin payment for order ${newOrder.id}`,
            user.id
          );
          if (!exchangeResult.success) {
            console.error('Exchange credit update failed:', exchangeResult.error);
          }
        }

        return NextResponse.json(newOrder, { status: 201 });
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes('Insufficient stock')) {
            return NextResponse.json(
              { error: { message: error.message } },
              { status: 400 }
            );
          }
        }
        return errorResponse(error as Error);
      }
    },
    {
      requireAuth: true,
    }
  );
}