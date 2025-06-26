'use client';

import { useEffect } from 'react';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { UserStats } from '@/lib/users/stats/db';
import {
  TrackData,
  TrackStatsData,
  UpdateDocumentParams,
  UpdateTrackParams,
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
 * Hook to fetch track statistics only
 */
export function useTrackStats() {
  const query = useQuery<Record<string, number>>({
    queryKey: ['tracks', 'stats'],
    queryFn: async () => {
      const response = await fetch('/api/users/track?statsOnly=true');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch track statistics');
      }
      const data: TrackStatsData = await response.json();
      return data.trackStats;
    },
  });

  useEffect(() => {
    if (query.error) {
      notifications.show({
        title: 'Error',
        message: query.error.message || 'Failed to load track statistics',
        color: 'red',
      });
    }
  }, [query.error]);

  return query;
}

/**
 * Hook to fetch user's track info and statistics
 */
export function useUserTrackInfo() {
  const query = useQuery<TrackData>({
    queryKey: ['tracks', 'userInfo'],
    queryFn: async () => {
      const response = await fetch('/api/users/track');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch track information');
      }
      return response.json();
    },
  });

  useEffect(() => {
    if (query.error) {
      notifications.show({
        title: 'Error',
        message: query.error.message || 'Failed to load track information',
        color: 'red',
      });
    }
  }, [query.error]);

  return query;
}

/**
 * Hook to update user's track selection
 */
export function useTrackSelection() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, UpdateTrackParams>({
    mutationFn: async (params: UpdateTrackParams) => {
      const response = await fetch('/api/users/track', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to update track selection');
      }

      return response.json();
    },
    onSuccess: async () => {
      // Invalidate and refetch track-related queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['tracks'] }),
        queryClient.invalidateQueries({ queryKey: ['userProfile', 'current'] }),
      ]);

      notifications.show({
        title: 'Track Selected',
        message: 'Your track selection has been saved successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Selection Failed',
        message: error.message || 'Failed to save track selection',
        color: 'red',
      });
    },
  });
}
