import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { IconChevronDown, IconHome, IconLogout } from '@tabler/icons-react';
import { Avatar, Burger, Flex, Menu, Text, UnstyledButton } from '@mantine/core';

type PortalHeaderProps = {
  opened: boolean;
  toggle: () => void;
};

const PortalHeader = ({ opened, toggle }: PortalHeaderProps) => {
  return (
    <Flex justify="space-between" align="center" h="100%" px="md">
      <Flex align="center" gap="md">
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <div>Logo</div>
      </Flex>
      <Menu shadow="md" width={200} position="bottom-end">
        <Menu.Target>
          <UnstyledButton>
            <Flex align="center" gap={4}>
              <Text size="sm" fw={400} mr={5}>
                Nishith Pinnawala
              </Text>
              <Flex align="center">
                <Avatar color="blue" radius="xl" size="md">
                  NP
                </Avatar>
              </Flex>
              <IconChevronDown size={16} stroke={1.5} />
            </Flex>
          </UnstyledButton>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item leftSection={<IconHome size={16} />}>Home</Menu.Item>
          <Menu.Item leftSection={<IconLogout size={16}/>} color="red" component={LogoutLink}>
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Flex>
  );
};

export default PortalHeader;
