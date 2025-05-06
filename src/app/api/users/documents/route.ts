import { NextRequest, NextResponse } from 'next/server';
import { isAdmin, withAuth } from '@/lib/auth/utils';
import {
  AuthorizationError,
  BadRequestError,
  errorResponse,
  NotFoundError,
} from '@/lib/core/errors';
import { supabaseServer } from '@/lib/core/supabase';

interface UpdateDocumentRequest {
  userId: string;
  document: string;
  status?: boolean;
  link?: string;
}

/**
 * PATCH /api/users/documents
 * Update the status or link of a user's document
 * Admin only endpoint
 */
export async function PATCH(request: NextRequest) {
  return withAuth(
    request,
    async (req) => {
      try {
        const userIsAdmin = await isAdmin();
        if (!userIsAdmin) {
          throw new AuthorizationError('Admin access required to update document status');
        }

        const body = (await req.json()) as UpdateDocumentRequest;
        const { userId, document, status, link } = body;

        if (!userId) {
          throw new BadRequestError('User ID is required');
        }

        if (!document) {
          throw new BadRequestError('Document type is required');
        }

        if (status === undefined && link === undefined) {
          throw new BadRequestError('Either status or link must be provided');
        }

        const { data: user, error: userError } = await supabaseServer
          .from('users')
          .select('kinde_id')
          .eq('kinde_id', userId)
          .single();

        if (userError || !user) {
          throw new NotFoundError('User not found');
        }

        const { error: docError } = await supabaseServer
          .from('user_documents')
          .select('user_id')
          .eq('user_id', userId)
          .single();

        const updateData: Record<string, boolean | string> = {};

        switch (document) {
          case 'passport':
            if (status !== undefined) {
              updateData.passport = status;
            }
            if (link !== undefined) {
              updateData.passport_link = link;
            }
            break;
          case 'anti_harassment':
            if (status !== undefined) {
              updateData.anti_harassment = status;
            }
            if (link !== undefined) {
              updateData.anti_harassment_link = link;
            }
            break;
          case 'indemnity':
            if (status !== undefined) {
              updateData.indemnity = status;
            }
            if (link !== undefined) {
              updateData.indemnity_link = link;
            }
            break;
          case 'anti_substance':
            if (status !== undefined) {
              updateData.anti_substance = status;
            }
            if (link !== undefined) {
              updateData.anti_substance_link = link;
            }
            break;
          case 'visa_confirmation':
            if (status !== undefined) {
              updateData.visa_confirmation = status;
            }
            if (link !== undefined) {
              updateData.visa_link = link;
            }
            break;
          case 'flight_ticket':
            if (status !== undefined) {
              updateData.flight_ticket = status;
            }
            if (link !== undefined) {
              updateData.flight_link = link;
            }
            break;
          default:
            throw new BadRequestError('Invalid document type');
        }

        let result;

        // If document record doesn't exist, create it
        if (docError) {
          const defaultValues = {
            user_id: userId,
            passport: false,
            anti_harassment: false,
            indemnity: false,
            anti_substance: false,
            visa_confirmation: false,
            flight_ticket: false,
          };

          // Insert create record
          const { data, error } = await supabaseServer
            .from('user_documents')
            .insert({ ...defaultValues, ...updateData })
            .select()
            .single();

          if (error) {
            throw new Error(`Failed to create document record: ${error.message}`);
          }
          result = data;
        } else {
          // Update existing record
          const { data, error } = await supabaseServer
            .from('user_documents')
            .update(updateData)
            .eq('user_id', userId)
            .select()
            .single();

          if (error) {
            throw new Error(`Failed to update document: ${error.message}`);
          }
          result = data;
        }

        return NextResponse.json({
          message: 'Document updated successfully',
          data: result,
        });
      } catch (error) {
        return errorResponse(error as Error);
      }
    },
    { requireAuth: true }
  );
}
