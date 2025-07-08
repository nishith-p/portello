import { useMutation, useQuery } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';

export function useYSFSelectionInfo(email: string) {
  return useQuery({
    queryKey: ['ysf-selection-info', email],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/ysf?email=${encodeURIComponent(email)}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to fetch selection info');
        }
        return response.json();
      } catch (error) {
        console.error('Error in useYSFSelectionInfo:', error);
        notifications.show({
          title: 'Error',
          message: 'Failed to load your selections',
          color: 'red',
        });
        throw error;
      }
    },
    enabled: !!email,
  });
}

export function useAllYSFStats() {
  return useQuery({
    queryKey: ['ysf-stats'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/ysf?statsOnly=true');
        if (!response.ok) {
          throw new Error('Failed to fetch track stats');
        }
        return response.json();
      } catch (error) {
        console.error('Error in useAllYSFStats:', error);
        notifications.show({
          title: 'Error',
          message: 'Failed to load session availability',
          color: 'red',
        });
        throw error;
      }
    },
  });
}

export function useCreateYSFSelection() {
  return useMutation({
    mutationFn: async (data: {
      email: string;
      track1: string;
      track2: string;
      panel: string;
      full_name: string;
    }) => {
      try {
        const response = await fetch('/api/ysf', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to create selections');
        }
        
        return response.json();
      } catch (error) {
        console.error('Error in useCreateYSFSelection mutation:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      notifications.show({
        title: 'Success!',
        message: `Your selections have been saved`,
        color: 'green',
      });
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to save selections',
        color: 'red',
      });
    },
  });
}
