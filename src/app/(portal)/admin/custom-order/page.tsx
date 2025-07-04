'use client';

import { useState } from 'react';
import { IconX, IconUser, IconPackage, IconShoppingCart, IconCoins, IconCash } from '@tabler/icons-react';
import {
  Alert,
  Button,
  Container,
  Group,
  Paper,
  Stack,
  Title,
  Select,
  Text,
  Badge,
  ActionIcon,
  NumberInput,
  Divider,
  Card,
  SimpleGrid,
  Modal,
  TextInput,
  Textarea,
  Avatar,
  Radio
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useUserSearch } from '@/lib/users/hooks';
import { useStoreItems } from '@/lib/store/items/hooks';
import { useStorePacks } from '@/lib/store/packs/hooks';
import { useAdminWallet } from '@/lib/wallet/hooks';
import { UserListItem } from '@/lib/users/types';
import { StoreItem, StorePack, CreateOrderItemInput, CreateOrderPackItem } from '@/lib/store/types';
import classes from './custom-order.module.css';

interface CustomOrderItem {
  id: string;
  type: 'item' | 'pack';
  data: StoreItem | StorePack;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export default function CustomOrderPage() {
  const [selectedDelegate, setSelectedDelegate] = useState<UserListItem | null>(null);
  const [orderItems, setOrderItems] = useState<CustomOrderItem[]>([]);
  const [delegateSearchOpened, { open: openDelegateSearch, close: closeDelegateSearch }] = useDisclosure(false);
  const [itemSearchOpened, { open: openItemSearch, close: closeItemSearch }] = useDisclosure(false);
  const [packSearchOpened, { open: openPackSearch, close: closePackSearch }] = useDisclosure(false);
  const [confirmModalOpened, { open: openConfirmModal, close: closeConfirmModal }] = useDisclosure(false);
  const [delegateSearch, setDelegateSearch] = useState('');
  const [itemSearch, setItemSearch] = useState('');
  const [packSearch, setPackSearch] = useState('');
  const [notes, setNotes] = useState('');
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  
  // Payment and exchange handling state
  const [paymentMethod, setPaymentMethod] = useState<'unpaid' | 'admin_paid' | 'credit_only'>('unpaid');
  const [exchangeAmount, setExchangeAmount] = useState<number>(0);
  const [exchangeCashAmount, setExchangeCashAmount] = useState<number>(0);
  const [exchangeCreditAmount, setExchangeCreditAmount] = useState<number>(0);

  // Hooks
  const { data: delegatesData } = useUserSearch({ search: delegateSearch, limit: 50, offset: 0 });
  const { data: itemsData } = useStoreItems();
  const { data: packsData } = useStorePacks();
  const { walletData, refetch: refetchWallet } = useAdminWallet(selectedDelegate?.kinde_id);

  const delegates = delegatesData?.users || [];
  const items = itemsData?.items || [];
  const packs = packsData?.packs || [];

  const handleSelectDelegate = (delegate: UserListItem) => {
    setSelectedDelegate(delegate);
    closeDelegateSearch();
    setDelegateSearch('');
  };

  const handleAddItem = (item: StoreItem) => {
    const newOrderItem: CustomOrderItem = {
      id: `item_${item.id}_${Date.now()}`,
      type: 'item',
      data: item,
      quantity: 1,
    };
    setOrderItems([...orderItems, newOrderItem]);
    closeItemSearch();
    setItemSearch('');
  };

  const handleAddPack = (pack: StorePack) => {
    const newOrderItem: CustomOrderItem = {
      id: `pack_${pack.id}_${Date.now()}`,
      type: 'pack',
      data: pack,
      quantity: 1,
    };
    setOrderItems([...orderItems, newOrderItem]);
    closePackSearch();
    setPackSearch('');
  };

  const handleRemoveItem = (itemId: string) => {
    setOrderItems(orderItems.filter(item => item.id !== itemId));
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    setOrderItems(orderItems.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    ));
  };

  const handleUpdateSize = (itemId: string, size: string) => {
    setOrderItems(orderItems.map(item => 
      item.id === itemId ? { ...item, selectedSize: size } : item
    ));
  };

  const handleUpdateColor = (itemId: string, color: string) => {
    setOrderItems(orderItems.map(item => 
      item.id === itemId ? { ...item, selectedColor: color } : item
    ));
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, orderItem) => {
      return total + (orderItem.data.price * orderItem.quantity);
    }, 0);
  };

  const handleCreateOrderClick = () => {
    if (!selectedDelegate) {
      notifications.show({
        title: 'Error',
        message: 'Please select a delegate first',
        color: 'red',
      });
      return;
    }

    if (orderItems.length === 0) {
      notifications.show({
        title: 'Error',
        message: 'Please add at least one item to the order',
        color: 'red',
      });
      return;
    }

    // Check if delegate has enough credits for credit_only payment
    if (paymentMethod === 'credit_only' && walletData) {
      const orderTotal = calculateTotal();
      if (walletData.wallet.credit < orderTotal) {
        notifications.show({
          title: 'Insufficient Credits',
          message: `Delegate has €${walletData.wallet.credit.toFixed(2)} but order total is €${orderTotal.toFixed(2)}`,
          color: 'red',
        });
        return;
      }
    }

    openConfirmModal();
  };

  const handleCreateOrder = async () => {
    closeConfirmModal();
    setIsCreatingOrder(true);

    try {
      const orderData: (CreateOrderItemInput | CreateOrderPackItem)[] = orderItems.map(orderItem => {
        if (orderItem.type === 'item') {
          const item = orderItem.data as StoreItem;
          return {
            item_code: item.item_code,
            quantity: orderItem.quantity,
            price: item.price,
            size: orderItem.selectedSize || null,
            color: orderItem.selectedColor || null,
            name: item.name,
            image: item.images?.[0] || null,
            pre_price: item.pre_price || 0,
            discount_perc: item.discount_perc || 0,
          } as CreateOrderItemInput;
        } 
        
        const pack = orderItem.data as StorePack;
        return {
          item_code: pack.pack_code,
          quantity: orderItem.quantity,
          price: pack.price,
          name: pack.name,
          image: pack.images?.[0] || null,
          is_pack: true,
          pack_items: pack.pack_items?.map(packItem => ({
            item_code: packItem.item?.item_code || '',
            quantity: packItem.quantity,
            price: 0,
            name: packItem.item?.name || '',
            image: packItem.item?.images?.[0] || null,
          })) || [],
          pre_price: pack.pre_price || 0,
          discount_perc: pack.discount_perc || 0,
        } as CreateOrderPackItem;
      });

      // Create order using the admin endpoint with custom user_id
      const orderPayload = {
        user_id: selectedDelegate!.kinde_id,
        items: orderData,
        total_amount: calculateTotal(),
        notes: notes.trim() || undefined,
        payment_method: paymentMethod,
        exchange_amount: paymentMethod === 'admin_paid' && exchangeAmount > 0 ? exchangeAmount : undefined,
        exchange_cash_amount: paymentMethod === 'admin_paid' && exchangeAmount > 0 ? exchangeCashAmount : undefined,
        exchange_credit_amount: paymentMethod === 'admin_paid' && exchangeAmount > 0 ? exchangeCreditAmount : undefined,
      };

      const response = await fetch('/api/store/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to create order');
      }

      await response.json();

      notifications.show({
        title: 'Success',
        message: `Custom order created successfully for ${selectedDelegate!.full_name}${
          paymentMethod === 'admin_paid' ? ' and marked as paid' : ''
        }${
          exchangeAmount > 0 ? ` with €${exchangeCreditAmount.toFixed(2)} added to their wallet` : ''
        }`,
        color: 'green',
      });

      // Reset form
      setSelectedDelegate(null);
      setOrderItems([]);
      setNotes('');
      setPaymentMethod('unpaid');
      setExchangeAmount(0);
      setExchangeCashAmount(0);
      setExchangeCreditAmount(0);
      
      // Refresh wallet data
      refetchWallet();

    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to create order',
        color: 'red',
      });
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(itemSearch.toLowerCase()) ||
    item.item_code.toLowerCase().includes(itemSearch.toLowerCase())
  );

  const filteredPacks = packs.filter(pack =>
    pack.name.toLowerCase().includes(packSearch.toLowerCase()) ||
    pack.pack_code.toLowerCase().includes(packSearch.toLowerCase())
  );

  return (
    <Container fluid p="md">
      <Stack gap="lg">
        <Title order={2} c="gray.8">
          Create Custom Order
        </Title>
        <Text c="dimmed">
          Create custom orders for delegates by selecting a delegate and adding items or packs.
        </Text>

        {/* Step 1: Select Delegate */}
        <Paper p="md" withBorder radius="md">
          <Stack gap="md">
            <Group justify="space-between">
              <Group gap="md">
                <Badge size="lg" color={selectedDelegate ? "green" : "blue"}>
                  {selectedDelegate ? "✓" : "1"}
                </Badge>
                <Text fw={600} size="lg">
                  Step 1: Select Delegate
                </Text>
              </Group>
              <Button
                leftSection={<IconUser size={16} />}
                variant="light"
                onClick={openDelegateSearch}
              >
                {selectedDelegate ? 'Change Delegate' : 'Select Delegate'}
              </Button>
            </Group>

            {selectedDelegate && (
              <Card withBorder p="md" radius="md" className={classes.selectedDelegateCard}>
                <Group justify="space-between">
                  <Group>
                    <Avatar
                      src={null}
                      size={48}
                      radius="xl"
                      color="blue"
                    >
                      {selectedDelegate.full_name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <div>
                      <Text fw={600}>{selectedDelegate.full_name}</Text>
                      <Text size="sm" c="dimmed">{selectedDelegate.position}</Text>
                      <Text size="sm" c="dimmed">{selectedDelegate.entity}</Text>
                    </div>
                  </Group>
                  
                  {walletData && (
                    <Stack gap={4} align="flex-end">
                      <Text size="xs" c="dimmed">Wallet Balance</Text>
                      <Group gap="xs">
                        <IconCoins size={16} color="var(--mantine-color-yellow-6)" />
                        <Text fw={600} c="blue">€{walletData.wallet.credit.toFixed(2)}</Text>
                      </Group>
                    </Stack>
                  )}
                </Group>
              </Card>
            )}
          </Stack>
        </Paper>

        {/* Step 2: Add Items */}
        <Paper p="md" withBorder radius="md">
          <Stack gap="md">
            <Group justify="space-between">
              <Group gap="md">
                <Badge size="lg" color={orderItems.length > 0 ? "green" : selectedDelegate ? "blue" : "gray"}>
                  {orderItems.length > 0 ? "✓" : "2"}
                </Badge>
                <Text fw={600} size="lg">
                  Step 2: Add Items & Packs
                </Text>
              </Group>
              <Group>
                <Button
                  leftSection={<IconPackage size={16} />}
                  variant="outline"
                  onClick={openItemSearch}
                  disabled={!selectedDelegate}
                >
                  Add Items
                </Button>
                <Button
                  leftSection={<IconPackage size={16} />}
                  variant="outline"
                  onClick={openPackSearch}
                  disabled={!selectedDelegate}
                >
                  Add Packs
                </Button>
              </Group>
            </Group>

            {orderItems.length === 0 ? (
              <Alert>
                No items added yet. Use the buttons above to add items or packs to this order.
              </Alert>
            ) : (
              <Stack gap="md">
                {orderItems.map((orderItem) => (
                  <Card key={orderItem.id} withBorder p="md" radius="md" className={classes.orderItemCard}>
                    <Group justify="space-between" align="flex-start">
                      <Group align="flex-start" gap="md">
                        <div>
                          <Group gap="xs" mb="xs">
                            <Text fw={600}>{orderItem.data.name}</Text>
                            <Badge color={orderItem.type === 'item' ? 'blue' : 'green'}>
                              {orderItem.type === 'item' ? 'Item' : 'Pack'}
                            </Badge>
                          </Group>
                          <Text size="sm" c="dimmed" mb="xs">
                            {orderItem.type === 'item' 
                              ? (orderItem.data as StoreItem).item_code
                              : (orderItem.data as StorePack).pack_code
                            }
                          </Text>
                          <Text size="sm" fw={600} c="blue">
                            €{orderItem.data.price.toFixed(2)} each
                          </Text>

                          {/* Size and Color selection for items */}
                          {orderItem.type === 'item' && (
                            <Group gap="md" mt="md">
                              {(orderItem.data as StoreItem).sizes && (orderItem.data as StoreItem).sizes.length > 0 && (
                                <Select
                                  placeholder="Select size"
                                  data={(orderItem.data as StoreItem).sizes || []}
                                  value={orderItem.selectedSize || ''}
                                  onChange={(value) => handleUpdateSize(orderItem.id, value || '')}
                                  style={{ width: 120 }}
                                />
                              )}
                              {(orderItem.data as StoreItem).colors && (orderItem.data as StoreItem).colors.length > 0 && (
                                <Select
                                  placeholder="Select color"
                                  data={(orderItem.data as StoreItem).colors?.map(color => ({
                                    value: color.name,
                                    label: color.name,
                                  })) || []}
                                  value={orderItem.selectedColor || ''}
                                  onChange={(value) => handleUpdateColor(orderItem.id, value || '')}
                                  style={{ width: 120 }}
                                />
                              )}
                            </Group>
                          )}

                          {/* Show pack items for packs */}
                          {orderItem.type === 'pack' && (orderItem.data as StorePack).pack_items && (
                            <div style={{ marginTop: 8 }}>
                              <Text size="sm" fw={500} mb="xs">Pack contains:</Text>
                              <Stack gap={4}>
                                {(orderItem.data as StorePack).pack_items?.map((packItem, idx) => (
                                  <Text key={idx} size="xs" c="dimmed">
                                    {packItem.quantity}x {packItem.item?.name}
                                  </Text>
                                ))}
                              </Stack>
                            </div>
                          )}
                        </div>
                      </Group>

                      <Group gap="xs" align="center">
                        <NumberInput
                          value={orderItem.quantity}
                          onChange={(value) => handleUpdateQuantity(orderItem.id, value as number)}
                          min={1}
                          style={{ width: 80 }}
                        />
                        <Text fw={600} style={{ minWidth: 80, textAlign: 'right' }}>
                          €{(orderItem.data.price * orderItem.quantity).toFixed(2)}
                        </Text>
                        <ActionIcon
                          color="red"
                          variant="light"
                          onClick={() => handleRemoveItem(orderItem.id)}
                        >
                          <IconX size={16} />
                        </ActionIcon>
                      </Group>
                    </Group>
                  </Card>
                ))}
              </Stack>
            )}
          </Stack>
        </Paper>

        {/* Step 3: Order Summary */}
        {(selectedDelegate && orderItems.length > 0) && (
          <Paper p="md" withBorder radius="md" bg="gray.0">
            <Stack gap="md">
              <Text fw={600} size="lg">
                Order Summary
              </Text>
              
              <Group justify="space-between">
                <Text>Delegate:</Text>
                <Text fw={600}>{selectedDelegate.full_name}</Text>
              </Group>
              
              <Group justify="space-between">
                <Text>Items:</Text>
                <Text fw={600}>{orderItems.length} item{orderItems.length !== 1 ? 's' : ''}</Text>
              </Group>
              
              <Group justify="space-between">
                <Text>Subtotal:</Text>
                <Text fw={600} c="blue">€{calculateTotal().toFixed(2)}</Text>
              </Group>
            </Stack>
          </Paper>
        )}

        {/* Step 4: Payment Method and Exchange */}
        <Paper p="md" withBorder radius="md">
          <Stack gap="md">
            <Text fw={600} size="lg">
              Payment & Exchange Options
            </Text>
            
            <Radio.Group
              value={paymentMethod}
              onChange={(value) => setPaymentMethod(value as 'unpaid' | 'admin_paid' | 'credit_only')}
              name="paymentMethod"
              label="Payment Method"
              description="Choose how this order should be handled"
            >
              <Stack mt="xs" gap="xs">
                <Radio value="unpaid" label="Leave unpaid (delegate pays later)" />
                <Radio value="admin_paid" label="Mark as paid by admin (with optional exchange)" />
                <Radio 
                  value="credit_only" 
                  label={`Pay with delegate's credits only ${
                    walletData ? `(Available: €${walletData.wallet.credit.toFixed(2)})` : ''
                  }`}
                  disabled={!walletData || walletData.wallet.credit < calculateTotal()}
                />
              </Stack>
            </Radio.Group>

            {walletData && walletData.wallet.credit < calculateTotal() && (
              <Alert color="orange">
                Delegate has insufficient credits (€{walletData.wallet.credit.toFixed(2)}) for this order (€{calculateTotal().toFixed(2)}).
                Credit payment option is disabled.
              </Alert>
            )}

            {paymentMethod === 'admin_paid' && (
              <Paper p="md" bg="gray.0" radius="md" withBorder>
                <Stack gap="md">
                  <Text fw={500} size="sm">
                    Exchange Handling (Optional)
                  </Text>
                  <Text size="xs" c="dimmed">
                    If the delegate gave you more money than the order total, specify how to handle the exchange.
                  </Text>
                  
                  <NumberInput
                    label="Exchange Amount (€)"
                    placeholder="0.00"
                    value={exchangeAmount}
                    onChange={(value) => {
                      const amount = value as number;
                      setExchangeAmount(amount);
                      // Reset split amounts when exchange amount changes
                      setExchangeCashAmount(0);
                      setExchangeCreditAmount(0);
                    }}
                    min={0}
                    step={0.01}
                    leftSection={<IconCoins size={16} />}
                    description="Total amount to give back to delegate"
                  />

                  {exchangeAmount > 0 && (
                    <Stack gap="sm">
                      <Text fw={500} size="sm">
                        Split Exchange Amount:
                      </Text>
                      
                      <SimpleGrid cols={2}>
                        <NumberInput
                          label="Cash Amount (€)"
                          placeholder="0.00"
                          value={exchangeCashAmount}
                          onChange={(value) => {
                            const cashAmount = value as number;
                            setExchangeCashAmount(cashAmount);
                            setExchangeCreditAmount(Math.max(0, exchangeAmount - cashAmount));
                          }}
                          min={0}
                          max={exchangeAmount}
                          step={0.01}
                          leftSection={<IconCash size={16} />}
                        />
                        
                        <NumberInput
                          label="Credits Amount (€)"
                          placeholder="0.00"
                          value={exchangeCreditAmount}
                          onChange={(value) => {
                            const creditAmount = value as number;
                            setExchangeCreditAmount(creditAmount);
                            setExchangeCashAmount(Math.max(0, exchangeAmount - creditAmount));
                          }}
                          min={0}
                          max={exchangeAmount}
                          step={0.01}
                          leftSection={<IconCoins size={16} />}
                        />
                      </SimpleGrid>

                      {(exchangeCashAmount + exchangeCreditAmount) !== exchangeAmount && (
                        <Alert color="orange">
                          Warning: Cash (€{exchangeCashAmount.toFixed(2)}) + Credits (€{exchangeCreditAmount.toFixed(2)}) = €{(exchangeCashAmount + exchangeCreditAmount).toFixed(2)} 
                          but Exchange Total is €{exchangeAmount.toFixed(2)}
                        </Alert>
                      )}
                    </Stack>
                  )}
                </Stack>
              </Paper>
            )}
          </Stack>
        </Paper>

        {/* Step 5: Notes and Create Order */}
        <Paper p="md" withBorder radius="md">
          <Stack gap="md">
            <Text fw={600} size="lg">
              Step 5: Additional Notes & Create Order
            </Text>
            
            <Textarea
              label="Order Notes (Optional)"
              placeholder="Add any special instructions or notes for this order..."
              value={notes}
              onChange={(event) => setNotes(event.currentTarget.value)}
              minRows={3}
            />

            <Divider />

            <Group justify="space-between" align="center" className={classes.totalSection}>
              <div>
                <Text size="lg" fw={600}>
                  Total: €{calculateTotal().toFixed(2)}
                </Text>
                <Text size="sm" c="dimmed">
                  {orderItems.length} item{orderItems.length !== 1 ? 's' : ''} for {selectedDelegate?.full_name || 'no delegate selected'}
                </Text>
              </div>
              
              <Button
                leftSection={<IconShoppingCart size={16} />}
                size="lg"
                onClick={handleCreateOrderClick}
                disabled={!selectedDelegate || orderItems.length === 0 || isCreatingOrder}
                loading={isCreatingOrder}
              >
                Create Custom Order
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Stack>

      {/* Delegate Search Modal */}
      <Modal
        opened={delegateSearchOpened}
        onClose={closeDelegateSearch}
        title="Select Delegate"
        size="lg"
      >
        <Stack gap="md">
          <TextInput
            placeholder="Search delegates by name or email..."
            value={delegateSearch}
            onChange={(event) => setDelegateSearch(event.currentTarget.value)}
          />
          
          <Stack gap="xs" className={classes.searchResults}>
            {delegates.map((delegate) => (
              <Card
                key={delegate.kinde_id}
                withBorder
                p="md"
                radius="md"
                mih="fit-content"
                className={classes.itemCard}
                onClick={() => handleSelectDelegate(delegate)}
              >
                <Group>
                  <Avatar
                    src={null}
                    size={40}
                    radius="xl"
                    color="blue"
                  >
                    {delegate.full_name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  <div>
                    <Text fw={600}>{delegate.full_name}</Text>
                    <Text size="sm" c="dimmed">{delegate.position}</Text>
                    <Text size="sm" c="dimmed">{delegate.entity}</Text>
                  </div>
                </Group>
              </Card>
            ))}
          </Stack>
        </Stack>
      </Modal>

      {/* Item Search Modal */}
      <Modal
        opened={itemSearchOpened}
        onClose={closeItemSearch}
        title="Add Items"
        size="lg"
      >
        <Stack gap="md">
          <TextInput
            placeholder="Search items by name or code..."
            value={itemSearch}
            onChange={(event) => setItemSearch(event.currentTarget.value)}
          />
          
          <SimpleGrid cols={2}>
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                withBorder
                p="md"
                radius="md"
                className={classes.itemCard}
                onClick={() => handleAddItem(item)}
              >
                <Stack gap="xs">
                  <Text fw={600} lineClamp={1}>{item.name}</Text>
                  <Text size="sm" c="dimmed">{item.item_code}</Text>
                  <Text size="sm" fw={600} c="blue">€{item.price.toFixed(2)}</Text>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        </Stack>
      </Modal>

      {/* Pack Search Modal */}
      <Modal
        opened={packSearchOpened}
        onClose={closePackSearch}
        title="Add Packs"
        size="lg"
      >
        <Stack gap="md">
          <TextInput
            placeholder="Search packs by name or code..."
            value={packSearch}
            onChange={(event) => setPackSearch(event.currentTarget.value)}
          />
          
          <SimpleGrid cols={2}>
            {filteredPacks.map((pack) => (
              <Card
                key={pack.id}
                withBorder
                p="md"
                radius="md"
                className={classes.itemCard}
                onClick={() => handleAddPack(pack)}
              >
                <Stack gap="xs">
                  <Text fw={600} lineClamp={1}>{pack.name}</Text>
                  <Text size="sm" c="dimmed">{pack.pack_code}</Text>
                  <Text size="sm" fw={600} c="blue">€{pack.price.toFixed(2)}</Text>
                  <Text size="xs" c="dimmed">
                    {pack.pack_items?.length || 0} items
                  </Text>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        </Stack>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        opened={confirmModalOpened}
        onClose={closeConfirmModal}
        title="Confirm Order Creation"
        centered
      >
        <Stack gap="md">
          <Text>
            Are you sure you want to create this custom order for <Text span fw={600}>{selectedDelegate?.full_name}</Text>?
          </Text>
          
          <Alert>
            <Text size="sm">
              <Text span fw={600}>Items:</Text> {orderItems.length} item{orderItems.length !== 1 ? 's' : ''}
            </Text>
            <Text size="sm">
              <Text span fw={600}>Total:</Text> €{calculateTotal().toFixed(2)}
            </Text>
            <Text size="sm">
              <Text span fw={600}>Payment:</Text> {
                paymentMethod === 'unpaid' ? 'Leave unpaid' :
                paymentMethod === 'admin_paid' ? 'Mark as paid by admin' :
                'Pay with credits only'
              }
            </Text>
            {paymentMethod === 'admin_paid' && exchangeAmount > 0 && (
              <>
                <Text size="sm">
                  <Text span fw={600}>Exchange:</Text> €{exchangeAmount.toFixed(2)} 
                  (€{exchangeCashAmount.toFixed(2)} cash, €{exchangeCreditAmount.toFixed(2)} credits)
                </Text>
              </>
            )}
            {notes.trim() && (
              <Text size="sm">
                <Text span fw={600}>Notes:</Text> {notes.trim()}
              </Text>
            )}
          </Alert>

          <Group justify="flex-end">
            <Button variant="outline" onClick={closeConfirmModal}>
              Cancel
            </Button>
            <Button onClick={handleCreateOrder} loading={isCreatingOrder}>
              Confirm & Create Order
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}