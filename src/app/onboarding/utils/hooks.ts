import { useRouter } from 'next/navigation';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useCreateUser } from '@/lib/mutations/user';
import { BasicUser } from '@/types/user';
import { initialOnboardingFormValues, onboardingFormValidation } from './schemas';

export const useOnboardingForm = (kinde_id: string, kinde_email: string) => {
  const router = useRouter();
  const createUser = useCreateUser();

  const form = useForm<Omit<BasicUser, 'kinde_id' | 'kinde_email'>>({
    initialValues: initialOnboardingFormValues,
    validate: onboardingFormValidation,
  });

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      await createUser.mutateAsync({
        kinde_id,
        kinde_email,
        first_name: values.first_name.trim(),
        last_name: values.last_name.trim(),
        entity: values.entity,
        position: values.position,
      });

      notifications.show({
        title: 'Application Submitted',
        message: "Your profile is under review by the DX Team. We'll notify you once approved.",
        color: 'blue',
      });

      router.push('/portal');
    } catch (error) {
      notifications.show({
        title: 'Error',
        message:
          error instanceof Error ? error.message : 'Failed to create profile. Please try again.',
        color: 'red',
      });
    }
  });

  return {
    form,
    handleSubmit,
    isSubmitting: createUser.isPending,
  };
};
