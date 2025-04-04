'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';

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
