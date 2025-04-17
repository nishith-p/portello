'use client';

import { useEffect } from 'react';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { UserListResponse, UserProfile, UserSearchParams } from '@/lib/users/types';

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
// Interface for document update params
interface UpdateDocumentParams {
  userId: string;
  document:
    | 'passport'
    | 'anti_harassment'
    | 'indemnity'
    | 'anti_substance'
    | 'visa_confirmation'
    | 'flight_ticket';
  status?: boolean;
  link?: string;
}

// Function to update document status or link
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

// Hook for updating documents
export function useUpdateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDocument,
    onSuccess: (_data, variables) => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['userProfile', variables.userId] });

      // Show success notification
      notifications.show({
        title: 'Document Updated',
        message: `Document status has been updated successfully`,
        color: 'green',
      });
    },
    onError: (error) => {
      // Show error notification
      notifications.show({
        title: 'Update Failed',
        message: error.message || 'Failed to update document status',
        color: 'red',
      });
    },
  });
}

// Document type mapping
export const documentTypes = {
  passport: {
    label: 'Passport',
    statusField: 'passport',
    linkField: 'passport_link',
  },
  anti_harassment: {
    label: 'Anti-Harassment Form',
    statusField: 'anti_harassment',
    linkField: 'anti_harassment_link',
  },
  indemnity: {
    label: 'Indemnity Form',
    statusField: 'indemnity',
    linkField: 'indemnity_link',
  },
  anti_substance: {
    label: 'Anti-Substance Form',
    statusField: 'anti_substance',
    linkField: 'anti_substance_link',
  },
  visa_confirmation: {
    label: 'Visa Details',
    statusField: 'visa_confirmation',
    linkField: 'visa_link',
  },
  flight_ticket: {
    label: 'Flight Details',
    statusField: 'flight_ticket',
    linkField: 'flight_link',
  },
};
