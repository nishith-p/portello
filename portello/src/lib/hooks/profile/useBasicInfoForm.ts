import { useEffect, useState } from 'react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useUpdateUser } from '@/lib/hooks/useUser';
import { BasicUser } from '@/types/user';
import { basicInfoValidation } from './schemas';

/**
 * Hook for managing the basic information form
 */
export function useBasicInfoForm(initialData?: BasicUser | null) {
  const [isEditing, setIsEditing] = useState(false);
  const { mutateAsync: updateUser, isPending } = useUpdateUser();

  const form = useForm({
    initialValues: {
      first_name: initialData?.first_name ?? '',
      last_name: initialData?.last_name ?? '',
      entity: initialData?.entity ?? '',
      position: initialData?.position ?? '',
      kinde_email: initialData?.kinde_email ?? '',
    },
    validate: basicInfoValidation,
  });

  // Update form values when initialData changes
  useEffect(() => {
    if (initialData) {
      form.setValues({
        first_name: initialData.first_name,
        last_name: initialData.last_name,
        entity: initialData.entity,
        position: initialData.position,
        kinde_email: initialData.kinde_email,
      });
    }
  }, [initialData]);

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    if (initialData) {
      form.setValues({
        first_name: initialData.first_name,
        last_name: initialData.last_name,
        entity: initialData.entity,
        position: initialData.position,
        kinde_email: initialData.kinde_email,
      });
    }
    setIsEditing(false);
  };

  const handleSubmit = form.onSubmit(async (values) => {
    if (!initialData?.kinde_id) {
      notifications.show({
        title: 'Error',
        message: 'User ID is required for updating profile',
        color: 'red',
      });
      return;
    }

    try {
      await updateUser({
        userId: initialData.kinde_id,
        userData: {
          first_name: values.first_name.trim(),
          last_name: values.last_name.trim(),
          entity: values.entity.trim(),
          position: values.position.trim(),
        },
      });

      notifications.show({
        title: 'Success',
        message: 'Your profile has been updated successfully!',
        color: 'green',
      });

      setIsEditing(false);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to update profile',
        color: 'red',
      });
    }
  });

  return {
    form,
    isEditing,
    isSubmitting: isPending,
    handleSubmit,
    handleEdit,
    handleCancel,
  };
}