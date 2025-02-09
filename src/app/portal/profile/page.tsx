'use client';

import { useEffect } from 'react';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { Container, Stack } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useProfile } from '@/lib/mutations/user';
import { AdditionalInformationForm } from './components/AdditionalInformationForm';
import { BasicInformationForm } from './components/BasicInformationForm';
import { ProfileHeader } from './components/ProfileHeader';
import { useBasicInfoForm } from './utils/hooks';

const ProfilePage = () => {
  const { user, isLoading: isAuthLoading } = useKindeBrowserClient();
  const {
    basicInfo,
    isLoading: isBasicInfoLoading,
    updateBasicInfo,
    isUpdating,
  } = useProfile(user?.id || '');
  const { form, isEditing, handleEdit, handleCancel } = useBasicInfoForm(basicInfo);

  useEffect(() => {
    if (basicInfo) {
      form.setValues({
        first_name: basicInfo.first_name,
        last_name: basicInfo.last_name,
        entity: basicInfo.entity,
        position: basicInfo.position,
        kinde_email: basicInfo.kinde_email,
      });
    }
  }, [basicInfo]);

  const handleSubmit = async (values: any) => {
    try {
      updateBasicInfo(values);
      handleCancel();
      notifications.show({
        title: 'Success',
        message: 'Basic information updated!',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update profile',
        color: 'red',
      });
    }
  };

  return (
    <Container fluid p="md" style={{ minHeight: '100vh' }}>
      <Stack gap="lg">
        <ProfileHeader />
        <BasicInformationForm
          form={form}
          isLoading={isAuthLoading || isBasicInfoLoading || isUpdating}
          isEditing={isEditing}
          onEdit={handleEdit}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />
        <AdditionalInformationForm />
      </Stack>
    </Container>
  );
};

export default ProfilePage;
