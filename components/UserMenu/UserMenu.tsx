import {
    IconChevronDown,
  IconChevronRight,
  IconHeart,
  IconLogout,
  IconMessage,
  IconPlayerPause,
  IconSettings,
  IconStar,
  IconSwitchHorizontal,
  IconTrash,
  IconUserCircle,
} from '@tabler/icons-react';
import {
  ActionIcon,
  Avatar,
  Group,
  Menu,
  Text,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import classes from './UserMenu.module.css';

export function UserMenu() {
  const theme = useMantineTheme();
  return (
    <Group justify="center">
      <Menu
        withArrow
        width={300}
        position="bottom"
        transitionProps={{ transition: 'pop' }}
        withinPortal
      >
        <Menu.Target>
          <UnstyledButton className={classes.user}>
            <Group>
              <Avatar
                src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png"
                radius="xl"
              />
              {/* <IconChevronDown size={14} stroke={1.5} /> */}
            </Group>
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item rightSection={<IconChevronRight size={16} stroke={1.5} />}>
            <Group>
              <Avatar
                radius="xl"
                src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png"
              />

              <div>
                <Text fw={500}>Geeneth Punchihewa</Text>
                <Text size="xs" c="dimmed">
                  geeneth@ic2025.com
                </Text>
                <Text size="xs" c="dimmed">
                  AIESEC in Colombo South
                </Text>
                <Text size="xs" c="dimmed">
                  Sri Lanka
                </Text>
              </div>
            </Group>
          </Menu.Item>
          <Menu.Divider />
          <Menu.Label>Settings</Menu.Label>
          <Menu.Item leftSection={<IconSettings size={16} stroke={1.5} />}>
            Account settings
          </Menu.Item>
          <Menu.Item leftSection={<IconLogout size={16} stroke={1.5} />}>Logout</Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
