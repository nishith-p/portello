'use client'

import { useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { UserListResponse, UserProfile, UserSearchParams } from '@/types/users';
import { notifications } from '@mantine/notifications';

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
    }
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

      if (searchParams.search) {params.set('search', searchParams.search);}
      if (searchParams.entity) {params.set('entity', searchParams.entity);}
      if (searchParams.position) {params.set('position', searchParams.position);}
      if (searchParams.round !== undefined) {params.set('round', searchParams.round.toString());}
      if (searchParams.limit) {params.set('limit', searchParams.limit.toString());}
      if (searchParams.offset) {params.set('offset', searchParams.offset.toString());}

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
      if (!kindeId) {throw new Error('User ID is required');}

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