'use client';

import { useState } from 'react';
import { Button, Container, Tabs, Text, Title, Paper, Code, Box, TextInput, Textarea, NumberInput, Divider, Checkbox, Switch, Group } from '@mantine/core';
import { notifications } from '@mantine/notifications';

export default function ApiTestDashboard() {
  const [activeTab, setActiveTab] = useState<string | null>('items');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Store Item Form State
  const [itemForm, setItemForm] = useState({
    item_code: '',
    name: '',
    price: 0,
    description: '',
    images: '',
    sizes: '',
    colors: '',
    active: true
  });

  // Toggle Active Form State
  const [toggleActiveForm, setToggleActiveForm] = useState({
    itemCode: '',
    active: true
  });

  // Include Inactive Items State
  const [includeInactive, setIncludeInactive] = useState(false);

  // Order Status Form State
  const [orderStatusForm, setOrderStatusForm] = useState({
    orderId: '',
    status: 'pending'
  });

  // Generic fetch wrapper with error handling
  const fetchAPI = async (url: string, options = {}) => {
    setLoading(true);
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      setResults(data);

      if (response.ok) {
        notifications.show({
          title: 'Success',
          message: 'API request completed successfully',
          color: 'green'
        });
      } else {
        notifications.show({
          title: 'Error',
          message: data.error || 'Something went wrong',
          color: 'red'
        });
      }

      return data;
    } catch (error) {
      setResults({ error: error.message });
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  // API Test Functions
  const testGetItems = () => {
    const url = includeInactive
      ? '/api/store/items?includeInactive=true'
      : '/api/store/items';
    return fetchAPI(url);
  };

  const testGetItem = (id: string) => fetchAPI(`/api/store/items/${id}`);

  const testCreateItem = () => {
    try {
      // Parse the form inputs
      const images = itemForm.images.split('\n').filter(img => img.trim());
      const sizes = itemForm.sizes.split(',').map(size => size.trim());

      // Parse colors - expected format: "name1:#hex1,name2:#hex2"
      const colorPairs = itemForm.colors.split(',').filter(color => color.includes(':'));
      const colors = colorPairs.map(pair => {
        const [name, hex] = pair.split(':').map(item => item.trim());
        return { name, hex };
      });

      return fetchAPI('/api/store/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_code: itemForm.item_code,
          name: itemForm.name,
          price: Number(itemForm.price),
          description: itemForm.description,
          images,
          sizes,
          colors,
          active: itemForm.active
        })
      });
    } catch (error) {
      notifications.show({
        title: 'Form Error',
        message: error.message,
        color: 'red'
      });
    }
  };

  const testUpdateItem = (id: string) => {
    try {
      // Similar parsing as createItem
      const images = itemForm.images.split('\n').filter(img => img.trim());
      const sizes = itemForm.sizes.split(',').map(size => size.trim());
      const colorPairs = itemForm.colors.split(',').filter(color => color.includes(':'));
      const colors = colorPairs.map(pair => {
        const [name, hex] = pair.split(':').map(item => item.trim());
        return { name, hex };
      });

      return fetchAPI(`/api/store/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: itemForm.name,
          price: Number(itemForm.price),
          description: itemForm.description,
          images,
          sizes,
          colors,
          active: itemForm.active
        })
      });
    } catch (error) {
      notifications.show({
        title: 'Form Error',
        message: error.message,
        color: 'red'
      });
    }
  };

  const testToggleActive = () => {
    return fetchAPI(`/api/store/items/${toggleActiveForm.itemCode}/toggle-active`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: toggleActiveForm.active })
    });
  };

  const testDeleteItem = (id: string) => {
    if (confirm(`Are you sure you want to delete item ${id}?`)) {
      return fetchAPI(`/api/store/items/${id}`, { method: 'DELETE' });
    }
  };

  const testGetAllOrders = () => fetchAPI('/api/store/orders');

  const testGetOrder = (id: string) => fetchAPI(`/api/store/orders/${id}`);

  const testUpdateOrderStatus = () => {
    return fetchAPI(`/api/store/orders/${orderStatusForm.orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: orderStatusForm.status })
    });
  };

  const testGetMyOrders = () => fetchAPI('/api/store/orders/my');

  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="lg">API Testing Dashboard</Title>
      <Text mb="md" color="dimmed">Use this dashboard to test your API endpoints with proper Kinde Auth.</Text>

      <Tabs value={activeTab} onChange={setActiveTab} mb="xl">
        <Tabs.List>
          <Tabs.Tab value="items">Store Items</Tabs.Tab>
          <Tabs.Tab value="orders">Orders</Tabs.Tab>
          <Tabs.Tab value="my-orders">My Orders</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="items" pt="md">
          <Title order={3} mb="md">Test Store Items API</Title>

          <Paper withBorder p="md" mb="lg">
            <Title order={4} mb="md">Get All Items</Title>
            <Group mb="md">
              <Checkbox
                label="Include inactive items"
                checked={includeInactive}
                onChange={(e) => setIncludeInactive(e.currentTarget.checked)}
              />
            </Group>
            <Button onClick={testGetItems} loading={loading}>
              GET /api/store/items{includeInactive ? '?includeInactive=true' : ''}
            </Button>
          </Paper>

          <Paper withBorder p="md" mb="lg">
            <Title order={4} mb="md">Get Single Item</Title>
            <Textarea
              label="Item Code"
              placeholder="SHIRT-001"
              mb="md"
              value={itemForm.item_code}
              onChange={(e) => setItemForm({...itemForm, item_code: e.target.value})}
            />
            <Button onClick={() => testGetItem(itemForm.item_code)} loading={loading} disabled={!itemForm.item_code}>
              GET /api/store/items/{'{id}'}
            </Button>
          </Paper>

          <Paper withBorder p="md" mb="lg">
            <Title order={4} mb="md">Toggle Item Active Status</Title>
            <TextInput
              label="Item Code"
              placeholder="SHIRT-001"
              mb="md"
              value={toggleActiveForm.itemCode}
              onChange={(e) => setToggleActiveForm({...toggleActiveForm, itemCode: e.target.value})}
            />
            <Group mb="md">
              <Switch
                label={toggleActiveForm.active ? "Activate Item" : "Deactivate Item"}
                checked={toggleActiveForm.active}
                onChange={(e) => setToggleActiveForm({...toggleActiveForm, active: e.currentTarget.checked})}
              />
            </Group>
            <Button
              onClick={testToggleActive}
              loading={loading}
              disabled={!toggleActiveForm.itemCode}
              color={toggleActiveForm.active ? "green" : "orange"}
            >
              PATCH /api/store/items/{'{id}'}/toggle-active
            </Button>
          </Paper>

          <Paper withBorder p="md" mb="lg">
            <Title order={4} mb="md">Create/Update Item</Title>

            <TextInput
              label="Item Code"
              placeholder="SHIRT-002"
              mb="md"
              value={itemForm.item_code}
              onChange={(e) => setItemForm({...itemForm, item_code: e.target.value})}
            />

            <TextInput
              label="Name"
              placeholder="Conference Hoodie"
              mb="md"
              value={itemForm.name}
              onChange={(e) => setItemForm({...itemForm, name: e.target.value})}
            />

            <NumberInput
              label="Price"
              placeholder="29.99"
              mb="md"
              value={itemForm.price}
              onChange={(val) => setItemForm({...itemForm, price: val || 0})}
              min={0}
              precision={2}
              step={0.01}
            />

            <Textarea
              label="Description"
              placeholder="Product description..."
              mb="md"
              value={itemForm.description}
              onChange={(e) => setItemForm({...itemForm, description: e.target.value})}
            />

            <Textarea
              label="Images (one URL per line)"
              placeholder="https://example.com/image1.jpg"
              mb="md"
              value={itemForm.images}
              onChange={(e) => setItemForm({...itemForm, images: e.target.value})}
            />

            <TextInput
              label="Sizes (comma separated)"
              placeholder="S, M, L, XL"
              mb="md"
              value={itemForm.sizes}
              onChange={(e) => setItemForm({...itemForm, sizes: e.target.value})}
            />

            <TextInput
              label="Colors (name:hex, comma separated)"
              placeholder="Black:#000000, White:#FFFFFF"
              mb="md"
              value={itemForm.colors}
              onChange={(e) => setItemForm({...itemForm, colors: e.target.value})}
            />

            <Checkbox
              label="Active"
              mb="md"
              checked={itemForm.active}
              onChange={(e) => setItemForm({...itemForm, active: e.currentTarget.checked})}
            />

            <Box mb="md">
              <Button onClick={testCreateItem} loading={loading} mr="sm">
                POST /api/store/items
              </Button>

              <Button onClick={() => testUpdateItem(itemForm.item_code)} loading={loading} mr="sm">
                PUT /api/store/items/{'{id}'}
              </Button>

              <Button
                onClick={() => testDeleteItem(itemForm.item_code)}
                loading={loading}
                color="red"
                variant="outline"
              >
                DELETE /api/store/items/{'{id}'}
              </Button>
            </Box>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="orders" pt="md">
          <Title order={3} mb="md">Test Orders API (Admin)</Title>

          <Paper withBorder p="md" mb="lg">
            <Title order={4} mb="md">Get All Orders</Title>
            <Button onClick={testGetAllOrders} loading={loading}>
              GET /api/store/orders
            </Button>
          </Paper>

          <Paper withBorder p="md" mb="lg">
            <Title order={4} mb="md">Get Single Order</Title>
            <TextInput
              label="Order ID"
              placeholder="uuid"
              mb="md"
              value={orderStatusForm.orderId}
              onChange={(e) => setOrderStatusForm({...orderStatusForm, orderId: e.target.value})}
            />
            <Button
              onClick={() => testGetOrder(orderStatusForm.orderId)}
              loading={loading}
              disabled={!orderStatusForm.orderId}
            >
              GET /api/store/orders/{'{id}'}
            </Button>
          </Paper>

          <Paper withBorder p="md" mb="lg">
            <Title order={4} mb="md">Update Order Status</Title>
            <TextInput
              label="Order ID"
              placeholder="uuid"
              mb="md"
              value={orderStatusForm.orderId}
              onChange={(e) => setOrderStatusForm({...orderStatusForm, orderId: e.target.value})}
            />

            <TextInput
              label="Status"
              placeholder="pending, confirmed, paid, delivered, cancelled"
              mb="md"
              value={orderStatusForm.status}
              onChange={(e) => setOrderStatusForm({...orderStatusForm, status: e.target.value})}
            />

            <Button
              onClick={testUpdateOrderStatus}
              loading={loading}
              disabled={!orderStatusForm.orderId}
            >
              PUT /api/store/orders/{'{id}'}
            </Button>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="my-orders" pt="md">
          <Title order={3} mb="md">Test My Orders API</Title>

          <Paper withBorder p="md" mb="lg">
            <Title order={4} mb="md">Get My Orders</Title>
            <Button onClick={testGetMyOrders} loading={loading}>
              GET /api/store/orders/my
            </Button>
          </Paper>
        </Tabs.Panel>
      </Tabs>

      <Divider my="xl" />

      <Title order={3} mb="md">API Response</Title>
      <Paper withBorder p="md" style={{ maxHeight: '400px', overflow: 'auto' }}>
        {results ? (
          <Code block>{JSON.stringify(results, null, 2)}</Code>
        ) : (
          <Text color="dimmed" align="center">API response will appear here</Text>
        )}
      </Paper>
    </Container>
  );
}