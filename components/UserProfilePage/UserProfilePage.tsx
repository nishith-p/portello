"use client"

import { Container, Paper, Title, Text, Group, Stack, Avatar, Divider, Badge } from "@mantine/core"
import { IconMail, IconBriefcase, IconFlag, IconBuilding } from "@tabler/icons-react"

interface UserProfileProps {
  user: {
    firstName: string
    lastName: string
    gender: string
    aiesecEmail: string
    personalEmail: string
    photo: string
    lc: string
    country: string
    role: string
    expectations: string
    additionalInfo: string
  }
}

export default function UserProfilePage({ user }: UserProfileProps) {
  return (
    <Container size="sm" py="xl">
      <Paper shadow="md" radius="md" p="xl">
        <Stack align="center" mb="xl">
          <Avatar
            src={user.photo || "/placeholder.svg?height=120&width=120"}
            size={120}
            radius={60}
            alt={`${user.firstName} ${user.lastName}`}
          />
          <Title order={2}>{`${user.firstName} ${user.lastName}`}</Title>
          <Badge color="blue">{user.role}</Badge>
        </Stack>

        <Divider my="md" label="Personal Information" labelPosition="center" />
        <Stack gap="xs">
          <Group>
            <Text fw={500}>Gender:</Text>
            <Text>{user.gender}</Text>
          </Group>
          <Group>
            <IconMail size={18} />
            <Text>{user.personalEmail}</Text>
          </Group>
        </Stack>

        <Divider my="md" label="AIESEC Information" labelPosition="center" />
        <Stack gap="xs">
          <Group>
            <IconMail size={18} />
            <Text>{user.aiesecEmail}</Text>
          </Group>
          <Group>
            <IconFlag size={18} />
            <Text>{user.country}</Text>
          </Group>
          <Group>
            <IconBuilding size={18} />
            <Text>{user.lc}</Text>
          </Group>
          <Group>
            <IconBriefcase size={18} />
            <Text>{user.role}</Text>
          </Group>
        </Stack>

        <Divider my="md" label="Other Details" labelPosition="center" />
        <Stack gap="md">
          <div>
            <Text fw={500}>Expectations from IC 2025:</Text>
            <Text>{user.expectations}</Text>
          </div>
          <div>
            <Text fw={500}>Additional Information:</Text>
            <Text>{user.additionalInfo}</Text>
          </div>
        </Stack>
      </Paper>
    </Container>
  )
}

