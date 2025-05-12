'use client';

import { useEffect } from 'react';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { UserStats } from '@/lib/users/stats/db';
import {
  UpdateDocumentParams,
  UserListResponse,
  UserProfile,
  UserSearchParams,
} from '@/lib/users/types';

/**
 * Hook to fetch the current user's profile
 */
export function useCurrentUserProfile() {
  const query = useQuery<UserProfile>({
    queryKey: ['userProfile', 'current'],
    queryFn: async () => {
      const response = await fetch('/api/users');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch user profile');
      }
      return response.json();
    },
  });

  useEffect(() => {
    if (query.error) {
      notifications.show({
        title: 'Error',
        message: query.error.message || 'Failed to load user profile',
        color: 'red',
      });
    }
  }, [query.error]);

  return query;
}

/**
 * Hook to search users (admin only)
 */
export function useUserSearch(searchParams: UserSearchParams) {
  const query = useQuery<UserListResponse>({
    queryKey: ['users', 'search', searchParams],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (searchParams.search) {
        params.set('search', searchParams.search);
      }
      if (searchParams.entity) {
        params.set('entity', searchParams.entity);
      }
      if (searchParams.position) {
        params.set('position', searchParams.position);
      }
      if (searchParams.round !== undefined) {
        params.set('round', searchParams.round.toString());
      }
      if (searchParams.limit) {
        params.set('limit', searchParams.limit.toString());
      }
      if (searchParams.offset) {
        params.set('offset', searchParams.offset.toString());
      }

      const url = `/api/users?${params.toString()}`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to search users');
      }

      return response.json();
    },
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (query.error) {
      notifications.show({
        title: 'Error',
        message: query.error.message || 'Failed to load users',
        color: 'red',
      });
    }
  }, [query.error]);

  return query;
}

/**
 * Hook to fetch a specific user's profile (admin only)
 */
export function useUserProfile(kindeId: string | null) {
  const query = useQuery<UserProfile>({
    queryKey: ['userProfile', kindeId],
    queryFn: async () => {
      if (!kindeId) {
        throw new Error('User ID is required');
      }

      const response = await fetch(`/api/users?kindeId=${kindeId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch user profile');
      }

      return response.json();
    },
    enabled: !!kindeId, // Only run the query if kindeId is provided
  });

  useEffect(() => {
    if (query.error) {
      notifications.show({
        title: 'Error',
        message: query.error.message || 'Failed to load user profile',
        color: 'red',
      });
    }
  }, [query.error]);

  return query;
}

/**
 * Function to update user documents
 */
const updateDocument = async (params: UpdateDocumentParams) => {
  // For document names, we need to strip "_link" suffix if present
  const documentName = params.document.endsWith('_link')
    ? params.document.replace('_link', '')
    : params.document;

  const response = await fetch('/api/users/documents', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: params.userId,
      document: documentName,
      status: params.status,
      link: params.link,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to update document');
  }

  return response.json();
};

/**
 * Hook to update user documents
 */
export function useUpdateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDocument,
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['userProfile', variables.userId] });

      notifications.show({
        title: 'Document Updated',
        message: `Document status has been updated successfully`,
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Update Failed',
        message: error.message || 'Failed to update document status',
        color: 'red',
      });
    },
  });
}

/**
 * Hook for user statistics operations
 */
export function useUserHooks() {
  /**
   * Hook to fetch user statistics (admin only)
   */
  const useUserStats = () => {
    return useQuery<UserStats>({
      queryKey: ['users', 'stats'],
      queryFn: async () => {
        const response = await fetch('/api/users/stats');

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to fetch user statistics');
        }

        return response.json();
      },
    });
  };

  return {
    useUserStats,
  };
}

/**
 * Hook to handle account deletion request
 */
export function useRequestAccountDeletion() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, boolean>({
    mutationFn: async (deleteRequested: boolean) => {
      const response = await fetch('/api/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deleteRequested }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to request account deletion');
      }

      return response.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['userProfile', 'current'] });

      notifications.show({
        title: 'Request Submitted',
        message: 'Your account deletion request has been submitted successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Request Failed',
        message: error.message || 'Failed to submit account deletion request',
        color: 'red',
      });
    },
  });
}

/**
 * Hook to fetch user's payment status
 */
export function useUserPaymentStatus() {
  return useQuery<string | null>({
    queryKey: ['userPaymentStatus'],
    queryFn: async () => {
      const response = await fetch('/api/users/me/payment-status');
      if (!response.ok) {
        throw new Error('Failed to fetch payment status');
      }
      const data = await response.json();
      return data.payment || null;
    }
  });
}

/**
 * Hook to fetch delegate payment details
 */
export function useDelegatePaymentDetails(userId: string) {
  return useQuery({
    queryKey: ['delegatePaymentDetails', userId],
    queryFn: async () => {
      const response = await fetch(`/api/payments/latest?user_id=${userId}&type=delegate`);
      if (!response.ok) {
        throw new Error('Failed to fetch delegate payment details');
      }
      const data = await response.json();
      return data || null; // Explicitly return null if no data
    },
    enabled: !!userId // Only run if userId exists
  });
}

/**
 * Hook to initiate delegate payment
 */
export function useInitiateDelegatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (customerData: {
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      address: string;
      city: string;
      country: string;
      position: string;
    }) => {
      const response = await fetch('/api/payhere/create-delegate-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customer: customerData }),
      });
      if (!response.ok) {
        throw new Error('Failed to initiate delegate payment');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPaymentStatus'] });
      queryClient.invalidateQueries({ queryKey: ['delegatePaymentDetails'] });
    },
    onError: (error) => {
      notifications.show({
        title: 'Payment Error',
        message: error.message || 'Failed to initiate payment',
        color: 'red',
      });
    }
  });
}
