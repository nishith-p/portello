'use client';

import { IconArrowRight, IconBriefcase, IconBuildingSkyscraper } from '@tabler/icons-react';
import {
  Box,
  Button,
  Checkbox,
  Container,
  Group,
  Radio,
  Rating,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import {
  COUNTRYCODES,
  ENTITIES,
  LC,
  MEALPREFERENCE,
  POSITIONS,
  REGIONS,
  TSHIRTSIZES,
} from '../utils/constants';
import { useOnboardingForm } from '../utils/hooks';

type OnboardingFormProps = {
  kinde_id: string;
  kinde_email: string;
};

export const OnboardingForm = ({ kinde_id, kinde_email }: OnboardingFormProps) => {
  const { form, handleSubmit, isSubmitting } = useOnboardingForm(kinde_id, kinde_email);

  return (
    <Container size="sm" py="xl">
      <Stack gap="md">
        {/* Information Section */}
        <Box>
          <Title order={2} size="h2" fw={600} mb="xs" ta="center" c="gray.8">
            Let's Get Onboarded!
          </Title>
          <Text c="dimmed" size="sm" mb="lg" ta="center">
            Tell us about yourself. Our Delegates Experience Team will review your application
            shortly.
          </Text>
        </Box>

        {/* Form Section */}
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <Group grow>
              <TextInput
                {...form.getInputProps('first_name')}
                label="First Name"
                placeholder="Enter your first name"
                required
              />

              <TextInput
                {...form.getInputProps('last_name')}
                label="Last Name"
                placeholder="Enter your last name"
                required
              />
            </Group>

            <Radio.Group name="gender" label="Gender" required>
              <Group>
                <Radio label="Male" value="male" />
                <Radio label="Female" value="female" />
                <Radio label="Other" value="other" />
              </Group>
            </Radio.Group>

            <Group grow>
              <TextInput
                {...form.getInputProps('aiesec_email')}
                label="AIESEC Email"
                placeholder="Enter your AIESEC email"
                required
              />

              <TextInput
                {...form.getInputProps('personal_email')}
                label="Personal Email"
                placeholder="Enter your personal email"
                required
              />
            </Group>

            <Group align="flex-start" gap="xs">
              <Select
                {...form.getInputProps('country_code')}
                data={COUNTRYCODES}
                placeholder="+1"
                style={{ width: '100px' }}
              />
              <TextInput
                {...form.getInputProps('phone_number')}
                placeholder="Phone number"
                style={{ flex: 1 }}
              />
            </Group>

            <TextInput
              {...form.getInputProps('telegram_id')}
              label="Telegram ID"
              placeholder="Enter your telegram id"
              required
            />

            <Select
              {...form.getInputProps('region')}
              label="Region"
              placeholder="Select your region"
              data={REGIONS}
              leftSection={<IconBuildingSkyscraper size={16} />}
              searchable
              required
            />

            <Select
              {...form.getInputProps('entity')}
              label="Entity"
              placeholder="Select your entity"
              data={ENTITIES}
              leftSection={<IconBuildingSkyscraper size={16} />}
              searchable
              required
            />

            <Select
              {...form.getInputProps('lc')}
              label="LC"
              placeholder="Select your LC"
              data={LC}
              leftSection={<IconBuildingSkyscraper size={16} />}
              searchable
            />

            <Select
              {...form.getInputProps('position')}
              label="Role in AIESEC"
              placeholder="Select your role in AIESEC"
              data={POSITIONS}
              leftSection={<IconBriefcase size={16} />}
              searchable
              required
            />

            <Select
              {...form.getInputProps('tshirt_sizes')}
              label="T-shirt Sizes"
              placeholder="Select your t-shirt size"
              data={TSHIRTSIZES}
              leftSection={<IconBriefcase size={16} />}
              required
            />

            <Select
              {...form.getInputProps('meal_preference')}
              label="Meal Preferences"
              placeholder="Select your meal preference"
              data={MEALPREFERENCE}
              leftSection={<IconBriefcase size={16} />}
              searchable
              required
            />

            <TextInput
              {...form.getInputProps('allergies')}
              label="Do you have any allergies? If so, please mention them here"
              placeholder="Enter any allergies you have"
            />

            <TextInput
              {...form.getInputProps('medical_concerns')}
              label="If you got any other medical concerns, please specify them here"
              placeholder="Enter any other medical concerns you have"
            />

            <TextInput
              {...form.getInputProps('expectations')}
              label="What are your expectations towards the conference?"
              placeholder="Enter your expectations towards the conference"
            />

            <TextInput
              {...form.getInputProps('expectations_for_cc_faci')}
              label="What are your expectations towards the CC team and faci team?"
              placeholder="Enter your expectations towards the CC team and faci team"
            />

            <Radio.Group
              name="post_conference_trip"
              label="We are planning on a post conference tour for 3 days (2 nights), which will be approximately budgeted for a price range of 200-250 USD. If so, are you interested in joining the post conference tour?"
              required
            >
              <Group>
                <Radio label="Yes" value="yes" />
                <Radio label="No" value="no" />
              </Group>
            </Radio.Group>

            <Checkbox label="I agree to let the information I provided in this form be processed by AIESEC INTERNATIONAL, as well as partners that will be part of the conference" />

            <Checkbox label="I agree for any photos taken during the event in which you appear  to be used by AIESEC INTERNATIONAL for internal or external promotion materials" />

            <Rating defaultValue={0} />

            <TextInput
              {...form.getInputProps('expectations_for_cc_faci')}
              label="Any other message for the CC team?"
              placeholder="Enter any other message for the CC team"
            />

            <TextInput
              {...form.getInputProps('expectations_for_cc_faci')}
              label="If you’ve got any other clarifications, please mention them here"
              placeholder="Enter any other clarifications you need"
            />

            <Button
              type="submit"
              fullWidth
              loading={isSubmitting}
              disabled={isSubmitting}
              rightSection={!isSubmitting && <IconArrowRight size="1.1rem" />}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </Stack>
        </form>
      </Stack>
    </Container>
  );
};
