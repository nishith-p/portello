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
        aiesec_email: values.aiesec_email,
        personal_email: values.personal_email,
        country_code: values.country_code,
        phone_number: values.phone_number,
        telegram_id: values.telegram_id,
        region: values.region,
        entity: values.entity,
        lc: values.lc,
        position: values.position,
        tshirt_size: values.tshirt_size,
        meal_preferences: values.meal_preferences,
        allergies: values.allergies,
        medical_concerns: values.medical_concerns,
        expectations: values.expectations,
        expectations_for_cc_faci: values.expectations_for_cc_faci,
        post_conference_tour: values.post_conference_tour,
        ai_partner_consent: values.ai_partner_consent,
        promotional_consent: values.promotional_consent,
        excitement: values.excitement,
        other_message: values.other_message,
        clarifications: values.clarifications
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
