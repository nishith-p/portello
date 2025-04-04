'use client';

import { useEffect } from 'react';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { Container, Stack } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useUpdateUser, useUser } from '@/lib/hooks/useUser';
import { useBasicInfoForm } from '@/lib/hooks/profile';
import { ProfileHeader, BasicInformationForm, AdditionalInformationForm } from '@/components/profile';
import type { BasicUser } from '@/types/user';

const ProfilePage = () => {
  const { user, isLoading: isAuthLoading } = useKindeBrowserClient();
  const { data: basicInfo, isLoading: isBasicInfoLoading } = useUser(user?.id);
  const { mutate: updateBasicInfo, isPending: isUpdating } = useUpdateUser();
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
  }, [basicInfo]); // Removed form from dependencies

  const handleSubmit = async (values: Partial<BasicUser>) => {
    if (!user?.id) {
      return;
    }

    try {
      updateBasicInfo({
        userId: user.id,
        userData: values,
      });
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