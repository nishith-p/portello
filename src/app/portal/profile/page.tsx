'use client';
import { Container, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { ProfileHeader } from './_components/ProfileHeader';
import { BasicInformationForm } from './_components/BasicInformationForm';
import { AdditionalInformationForm } from './_components/AdditionalInformationForm';

type FormData = {
  firstName: string;
  lastName: string;
  entity: string;
  position: string;
  email: string;
};

const initialData: FormData = {
  firstName: 'John',
  lastName: 'Doe',
  entity: 'AIESEC in Sri Lanka',
  position: 'Member Committee President',
  email: 'john.doe@aiesec.net'
};

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm({
    initialValues: initialData,
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      firstName: (value) => (value.length < 2 ? 'First name is too short' : null),
      lastName: (value) => (value.length < 2 ? 'Last name is too short' : null),
      entity: (value) => (!value ? 'Entity is required' : null),
      position: (value) => (!value ? 'Position is required' : null),
    },
  });

  const handleSubmit = (values: FormData) => {
    console.log(values);
    setIsEditing(false);
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  return (
    <Container fluid p="md" style={{ minHeight: '100vh' }}>
      <Stack gap="lg">
        <ProfileHeader />
        <BasicInformationForm
          form={form}
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />
        <AdditionalInformationForm />
      </Stack>
    </Container>
  );
};

export default ProfilePage;