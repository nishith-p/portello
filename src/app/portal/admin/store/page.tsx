'use client';

import { useState } from 'react';
import {
  IconAlertCircle,
  IconEdit,
  IconEye,
  IconEyeglass,
  IconEyeglassOff,
  IconPlus,
  IconSearch,
} from '@tabler/icons-react';
import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Center,
  Container,
  Group,
  Loader,
  Modal,
  Paper,
  ScrollArea,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useStoreItemSearch, useUpdateStoreItemStatus } from '@/lib/api/hooks/useStoreItems';
import { StoreItem, StoreItemSearchParams } from '@/types/store';

export default function AdminStorePage(): JSX.Element {
  // State for search parameters
  const [searchParams, setSearchParams] = useState<
    Required<Pick<StoreItemSearchParams, 'limit' | 'offset'>> &
      Omit<StoreItemSearchParams, 'limit' | 'offset'>
  >({
    limit: 10,
    offset: 0,
  });

  // State for quick search input
  const [searchInput, setSearchInput] = useState('');
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);

  // State for item details modal
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);

  // Fetch store items with search parameters
  const { data, isLoading, error } = useStoreItemSearch(searchParams);
  const updateStatusMutation = useUpdateStoreItemStatus();

  // Handle search form submission
  const handleSearch = () => {
    setSearchParams((prev) => ({
      ...prev,
      search: searchInput,
      active: activeFilter,
      offset: 0, // Reset pagination when searching
    }));
  };

  // Handle enter key in search input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // View item details
  const handleViewItem = (item: StoreItem) => {
    setSelectedItem(item);
    open();
  };

  // Toggle item active status
  const handleToggleStatus = (item: StoreItem, e: React.MouseEvent) => {
    e.stopPropagation();
    updateStatusMutation.mutate({
      id: item.id,
      active: !item.active,
    });
  };

  // Handle pagination
  const handlePageChange = (newOffset: number) => {
    setSearchParams((prev) => ({
      ...prev,
      offset: newOffset,
    }));
  };

  return (
    <Container fluid p="md">
      <Stack gap="lg">
        <Group justify="space-between">
          <Title order={2} c="gray.8">
            Store Management
          </Title>
          <Button leftSection={<IconPlus size={16} />} component="a" href="/admin/store/new">
            Add Item
          </Button>
        </Group>

        <Paper p="md" radius="md" withBorder>
          <Group mb="md" justify="space-between">
            <Group>
              <TextInput
                placeholder="Search items"
                leftSection={<IconSearch size={16} />}
                value={searchInput}
                onChange={(e) => setSearchInput(e.currentTarget.value)}
                onKeyDown={handleKeyDown}
                style={{ width: '300px' }}
              />
              <Button onClick={handleSearch}>Search</Button>
            </Group>

            <Group>
              <Select
                placeholder="Status"
                data={[
                  { value: 'true', label: 'Active' },
                  { value: 'false', label: 'Inactive' },
                ]}
                clearable
                onChange={(value) => {
                  const active = value === 'true' ? true : value === 'false' ? false : undefined;
                  setActiveFilter(active);
                }}
              />
            </Group>
          </Group>

          {isLoading ? (
            <Center my="xl">
              <Loader size="md" />
            </Center>
          ) : error ? (
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Error loading store items"
              color="red"
            >
              {error.message || 'Failed to load store items. Please try again.'}
            </Alert>
          ) : (
            <>
              <ScrollArea>
                <Table striped highlightOnHover withTableBorder>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Code</Table.Th>
                      <Table.Th>Name</Table.Th>
                      <Table.Th>Price</Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th style={{ width: 150 }}>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {data?.items?.length ? (
                      data.items.map((item: StoreItem) => (
                        <Table.Tr
                          key={item.id}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleViewItem(item)}
                        >
                          <Table.Td>{item.item_code}</Table.Td>
                          <Table.Td>{item.name}</Table.Td>
                          <Table.Td>${item.price.toFixed(2)}</Table.Td>
                          <Table.Td>
                            <Badge color={item.active ? 'green' : 'red'} variant="filled">
                              {item.active ? 'Active' : 'Inactive'}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            <Group gap="xs">
                              <ActionIcon
                                variant="subtle"
                                color="blue"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewItem(item);
                                }}
                              >
                                <IconEye size={16} />
                              </ActionIcon>
                              <ActionIcon
                                variant="subtle"
                                component="a"
                                href={`/admin/store/edit/${item.id}`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <IconEdit size={16} />
                              </ActionIcon>
                              <ActionIcon
                                variant="subtle"
                                onClick={(e) => handleToggleStatus(item, e)}
                              >
                                {item.active ? (
                                  <IconEyeglass size={16} />
                                ) : (
                                  <IconEyeglassOff size={16} />
                                )}
                              </ActionIcon>
                            </Group>
                          </Table.Td>
                        </Table.Tr>
                      ))
                    ) : (
                      <Table.Tr>
                        <Table.Td colSpan={5}>
                          <Text ta="center" c="dimmed" py="md">
                            No store items found
                          </Text>
                        </Table.Td>
                      </Table.Tr>
                    )}
                  </Table.Tbody>
                </Table>
              </ScrollArea>

              {data && data.total > 0 && (
                <Group justify="space-between" mt="md">
                  <Text size="sm" c="dimmed">
                    Showing {Math.min(searchParams.offset + 1, data.total)} -{' '}
                    {Math.min(searchParams.offset + searchParams.limit, data.total)} of {data.total}{' '}
                    items
                  </Text>
                  <Group>
                    <Button
                      variant="outline"
                      disabled={searchParams.offset === 0}
                      onClick={() =>
                        handlePageChange(Math.max(0, searchParams.offset - searchParams.limit))
                      }
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      disabled={searchParams.offset + searchParams.limit >= (data?.total || 0)}
                      onClick={() => handlePageChange(searchParams.offset + searchParams.limit)}
                    >
                      Next
                    </Button>
                  </Group>
                </Group>
              )}
            </>
          )}
        </Paper>
      </Stack>

      {/* Item Details Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={
          <Text fw={700} size="lg">
            {selectedItem ? `Item Details: ${selectedItem.name}` : 'Item Details'}
          </Text>
        }
        size="lg"
        centered
      >
        {selectedItem && (
          <Stack>
            <Group>
              <Text fw={600} size="sm" style={{ width: 120 }}>
                ID:
              </Text>
              <Text>{selectedItem.id}</Text>
            </Group>

            <Group>
              <Text fw={600} size="sm" style={{ width: 120 }}>
                Code:
              </Text>
              <Text>{selectedItem.item_code}</Text>
            </Group>

            <Group>
              <Text fw={600} size="sm" style={{ width: 120 }}>
                Name:
              </Text>
              <Text>{selectedItem.name}</Text>
            </Group>

            <Group>
              <Text fw={600} size="sm" style={{ width: 120 }}>
                Price:
              </Text>
              <Text>${selectedItem.price.toFixed(2)}</Text>
            </Group>

            <Group align="flex-start">
              <Text fw={600} size="sm" style={{ width: 120 }}>
                Description:
              </Text>
              <Text style={{ flex: 1 }}>{selectedItem.description}</Text>
            </Group>

            <Group>
              <Text fw={600} size="sm" style={{ width: 120 }}>
                Status:
              </Text>
              <Badge color={selectedItem.active ? 'green' : 'red'}>
                {selectedItem.active ? 'Active' : 'Inactive'}
              </Badge>
            </Group>

            <Group align="flex-start">
              <Text fw={600} size="sm" style={{ width: 120 }}>
                Sizes:
              </Text>
              <div>
                {selectedItem.sizes.length > 0 ? (
                  <Group gap="xs">
                    {selectedItem.sizes.map((size, index) => (
                      <Badge key={index} variant="outline">
                        {size}
                      </Badge>
                    ))}
                  </Group>
                ) : (
                  <Text c="dimmed" size="sm">
                    No sizes specified
                  </Text>
                )}
              </div>
            </Group>

            <Group align="flex-start">
              <Text fw={600} size="sm" style={{ width: 120 }}>
                Colors:
              </Text>
              <div>
                {selectedItem.colors.length > 0 ? (
                  <Group gap="xs">
                    {selectedItem.colors.map((color, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        leftSection={
                          <div
                            style={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              backgroundColor: color.hex,
                              border: '1px solid #e0e0e0',
                            }}
                          />
                        }
                      >
                        {color.name}
                      </Badge>
                    ))}
                  </Group>
                ) : (
                  <Text c="dimmed" size="sm">
                    No colors specified
                  </Text>
                )}
              </div>
            </Group>

            <Group align="flex-start">
              <Text fw={600} size="sm" style={{ width: 120 }}>
                Images:
              </Text>
              <div>
                {selectedItem.images.length > 0 ? (
                  <Group gap="xs">
                    {selectedItem.images.map((_, index) => (
                      <Text key={index} size="sm">
                        Image {index + 1}
                      </Text>
                    ))}
                  </Group>
                ) : (
                  <Text c="dimmed" size="sm">
                    No images uploaded
                  </Text>
                )}
              </div>
            </Group>

            <Group mt={20} justify="flex-end">
              <Button variant="outline" onClick={close}>
                Close
              </Button>
              <Button component="a" href={`/admin/store/edit/${selectedItem.id}`} color="blue">
                Edit Item
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Container>
  );
}
