'use client';

import { useEffect } from 'react';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import {
  StoreItem,
  StoreItemInput,
  StoreItemListResponse,
  StoreItemSearchParams,
} from '@/lib/store/types';

/**
 * Hook to fetch store items for public view (active items only)
 */
export function useStoreItems() {
  const query = useQuery<StoreItemListResponse>({
    queryKey: ['storeItems', 'active'],
    queryFn: async () => {
      const response = await fetch('/api/store/items');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch store items');
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
 * Hook to fetch a specific store item by ID
 */
export function useStoreItem(id: string | null) {
  const query = useQuery<StoreItem>({
    queryKey: ['storeItem', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('Item ID is required');
      }

      const response = await fetch(`/api/store/items/${id}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch store item');
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
 * Hook to search store items (admin only)
 */
export function useStoreItemSearch(searchParams: StoreItemSearchParams) {
  const query = useQuery<StoreItemListResponse>({
    queryKey: ['storeItems', 'search', searchParams],
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

      const url = `/api/store/items/search?${params.toString()}`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to search store items');
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
 * Hook to create a new store item (admin only)
 */
export function useCreateStoreItem() {
  const queryClient = useQueryClient();

  return useMutation<StoreItem, Error, StoreItemInput>({
    mutationFn: async (itemData: StoreItemInput) => {
      const response = await fetch('/api/store/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to create store item');
      }

      return response.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['storeItems'] });

      notifications.show({
        title: 'Success',
        message: 'Store item created successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to create store item',
        color: 'red',
      });
    },
  });
}

/**
 * Hook to update an existing store item (admin only)
 */
export function useUpdateStoreItem() {
  const queryClient = useQueryClient();

  return useMutation<StoreItem, Error, { id: string; data: Partial<StoreItemInput> }>({
    mutationFn: async ({ id, data }) => {
      const response = await fetch(`/api/store/items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to update store item');
      }

      return response.json();
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['storeItems'] });
      await queryClient.invalidateQueries({ queryKey: ['storeItem', data.id] });

      notifications.show({
        title: 'Success',
        message: 'Store item updated successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to update store item',
        color: 'red',
      });
    },
  });
}

/**
 * Hook to update a store item's status (admin only)
 */
export function useUpdateStoreItemStatus() {
  const queryClient = useQueryClient();

  return useMutation<StoreItem, Error, { id: string; active: boolean }>({
    mutationFn: async ({ id, active }) => {
      const response = await fetch(`/api/store/items/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to update store item status');
      }

      return response.json();
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['storeItems'] });
      await queryClient.invalidateQueries({ queryKey: ['storeItem', data.id] });

      notifications.show({
        title: 'Success',
        message: `Store item ${data.active ? 'activated' : 'deactivated'} successfully`,
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to update store item status',
        color: 'red',
      });
    },
  });
}

/**
 * Hook to deactivate a store item (soft delete)
 */
export function useDeactivateStoreItem() {
  const queryClient = useQueryClient();

  return useMutation<StoreItem, Error, string>({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/store/items/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to deactivate store item');
      }

      return response.json();
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['storeItems'] });
      await queryClient.invalidateQueries({ queryKey: ['storeItem', data.id] });

      notifications.show({
        title: 'Success',
        message: 'Store item deactivated successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to deactivate store item',
        color: 'red',
      });
    },
  });
}
