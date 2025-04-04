'use client';

import { IconEdit, IconUser } from '@tabler/icons-react';
import { Box, Button, Card, Grid, LoadingOverlay, Stack, TextInput, Title } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { BasicUser } from '@/types/user';

interface BasicInformationFormProps {
  form: UseFormReturnType<Omit<BasicUser, 'kinde_id'>>;
  isLoading?: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSubmit: (values: Omit<BasicUser, 'kinde_id'>) => void;
}

export function BasicInformationForm({
  form,
  isLoading = false,
  isEditing,
  onEdit,
  onCancel,
  onSubmit,
}: BasicInformationFormProps) {
  return (
    <Card withBorder>
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack>
          <Box
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Title order={3} c="gray.7">
              <Box
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <IconUser size={24} />
                Basic Information
              </Box>
            </Title>
            {!isEditing ? (
              <Button variant="light" leftSection={<IconEdit size={16} />} onClick={onEdit}>
                Edit
              </Button>
            ) : null}
          </Box>

          <Grid gutter="lg">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="First Name"
                {...form.getInputProps('first_name')}
                disabled={!isEditing}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Last Name"
                {...form.getInputProps('last_name')}
                disabled={!isEditing}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="Entity" {...form.getInputProps('entity')} disabled={!isEditing} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Position"
                {...form.getInputProps('position')}
                disabled={!isEditing}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="Email Address" {...form.getInputProps('kinde_email')} disabled />
            </Grid.Col>
          </Grid>

          {isEditing && (
            <Box style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <Button variant="subtle" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </Box>
          )}
        </Stack>
      </form>
    </Card>
  );
}