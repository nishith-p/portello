'use client';

import { useEffect } from 'react';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import {
  StorePack,
  StorePackInput,
  StorePackItemInput,
  StorePackListResponse,
  StorePackSearchParams,
  StorePackWithItemsInput,
} from '@/lib/store/types';

/**
 * Hook to fetch store packs for public view (active packs only)
 */
export function useStorePacks() {
  const query = useQuery<StorePackListResponse>({
    queryKey: ['storePacks', 'active'],
    queryFn: async () => {
      const response = await fetch('/api/store/packs');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch store packs');
      }
      return response.json();
    },
  });

  useEffect(() => {
    if (query.error) {
      notifications.show({
        title: 'Error',
        message: query.error.message,
        color: 'red',
      });
    }
  }, [query.error]);

  return query;
}

/**
 * Hook to fetch a specific store pack by ID
 */
export function useStorePack(id: string | null) {
  const query = useQuery<StorePack>({
    queryKey: ['storePack', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('Pack ID is required');
      }

      const response = await fetch(`/api/store/packs/${id}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch store pack');
      }

      return response.json();
    },
    enabled: !!id, // Only run the query if id is provided
  });

  useEffect(() => {
    if (query.error) {
      notifications.show({
        title: 'Error',
        message: query.error.message,
        color: 'red',
      });
    }
  }, [query.error]);

  return query;
}

/**
 * Hook to search store packs (admin only)
 */
export function useStorePackSearch(searchParams: StorePackSearchParams) {
  const query = useQuery<StorePackListResponse>({
    queryKey: ['storePacks', 'search', searchParams],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (searchParams.search) {
        params.set('search', searchParams.search);
      }

      if (searchParams.active !== undefined) {
        params.set('active', searchParams.active.toString());
      }

      if (searchParams.limit) {
        params.set('limit', searchParams.limit.toString());
      }

      if (searchParams.offset) {
        params.set('offset', searchParams.offset.toString());
      }

      const url = `/api/store/packs/search?${params.toString()}`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to search store packs');
      }

      return response.json();
    },
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (query.error) {
      notifications.show({
        title: 'Error',
        message: query.error.message,
        color: 'red',
      });
    }
  }, [query.error]);

  return query;
}

/**
 * Hook to create a new store pack (admin only)
 */
export function useCreateStorePack() {
  const queryClient = useQueryClient();

  return useMutation<StorePack, Error, StorePackWithItemsInput>({
    mutationFn: async (packData: StorePackWithItemsInput) => {
      const response = await fetch('/api/store/packs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(packData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to create store pack');
      }

      return response.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['storePacks'] });

      notifications.show({
        title: 'Success',
        message: 'Store pack created successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to create store pack',
        color: 'red',
      });
    },
  });
}

/**
 * Hook to update an existing store pack (admin only)
 */
export function useUpdateStorePack() {
  const queryClient = useQueryClient();

  return useMutation<
    StorePack,
    Error,
    { id: string; data: Partial<StorePackInput>; packItems?: StorePackItemInput[] }
  >({
    mutationFn: async ({ id, data, packItems }) => {
      // Combine the data and pack items (if provided) for the API
      const requestBody: any = { ...data };
      if (packItems) {
        requestBody.pack_items = packItems;
      }

      const response = await fetch(`/api/store/packs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to update store pack');
      }

      return response.json();
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['storePacks'] });
      await queryClient.invalidateQueries({ queryKey: ['storePack', data.id] });

      notifications.show({
        title: 'Success',
        message: 'Store pack updated successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to update store pack',
        color: 'red',
      });
    },
  });
}

/**
 * Hook to update a store pack's status (admin only)
 */
export function useUpdateStorePackStatus() {
  const queryClient = useQueryClient();

  return useMutation<StorePack, Error, { id: string; active: boolean }>({
    mutationFn: async ({ id, active }) => {
      const response = await fetch(`/api/store/packs/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to update store pack status');
      }

      return response.json();
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['storePacks'] });
      await queryClient.invalidateQueries({ queryKey: ['storePack', data.id] });

      notifications.show({
        title: 'Success',
        message: `Store pack ${data.active ? 'activated' : 'deactivated'} successfully`,
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to update store pack status',
        color: 'red',
      });
    },
  });
}

/**
 * Hook to deactivate a store pack (soft delete)
 */
export function useDeactivateStorePack() {
  const queryClient = useQueryClient();

  return useMutation<StorePack, Error, string>({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/store/packs/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to deactivate store pack');
      }

      return response.json();
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['storePacks'] });
      await queryClient.invalidateQueries({ queryKey: ['storePack', data.id] });

      notifications.show({
        title: 'Success',
        message: 'Store pack deactivated successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to deactivate store pack',
        color: 'red',
      });
    },
  });
}
