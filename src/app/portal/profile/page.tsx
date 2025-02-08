'use client';

import { Container, Stack } from '@mantine/core';
import { AdditionalInformationForm } from './components/AdditionalInformationForm';
import { BasicInformationForm } from './components/BasicInformationForm';
import { ProfileHeader } from './components/ProfileHeader';
import { useBasicInfoForm } from './utils/hooks';

const ProfilePage = () => {
  const { form, isEditing, handleSubmit, handleEdit, handleCancel } = useBasicInfoForm();

  return (
    <Container fluid p="md" style={{ minHeight: '100vh' }}>
      <Stack gap="lg">
        <ProfileHeader />
        <BasicInformationForm
          form={form}
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
