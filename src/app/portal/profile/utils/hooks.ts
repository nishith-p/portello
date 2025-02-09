import { useState } from 'react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { BasicUser } from '@/types/user'; // Adjust according to your project structure
import { basicInfoValidation } from './schemas'; // Adjust the path if needed

export const useBasicInfoForm = (initialData?: BasicUser | null) => {
  const [isEditing, setIsEditing] = useState(false);
  // const updateUser = useUpdateUser(); // Uncomment and integrate your update logic when available

  const form = useForm({
    initialValues: {
      first_name: '',
      last_name: '',
      entity: '',
      position: '',
      kinde_email: '',
    },
    validate: basicInfoValidation,
  });

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

  return {
    form,
    isEditing,
    isSubmitting: false,
    handleSubmit,
    handleEdit,
    handleCancel,
  };
};
