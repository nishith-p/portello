import { useState } from 'react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { BasicUser } from '@/types/user';
import { initialBasicInfoData } from './constants';
import { basicInfoValidation } from './schemas';

export const useBasicInfoForm = () => {
  const [isEditing, setIsEditing] = useState(false);
  // const updateUser = useUpdateUser()

  const form = useForm<Omit<BasicUser, 'kinde_id'>>({
    initialValues: initialBasicInfoData,
    validate: basicInfoValidation,
  });

  const handleSubmit = async (values: Omit<BasicUser, 'kinde_id'>) => {
    try {
      // await updateUser.mutateAsync(values);
      console.log(values);

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
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  return {
    form,
    isEditing,
    isSubmitting: false,
    handleSubmit,
    handleEdit,
    handleCancel,
  };
};
