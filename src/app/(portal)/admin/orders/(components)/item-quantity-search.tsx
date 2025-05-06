import { TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

interface ItemQuantitySearchProps {
  searchInput: string;
  onSearchChange: (value: string) => void;
}

export function ItemQuantitySearch({
  searchInput,
  onSearchChange,
}: ItemQuantitySearchProps) {
  return (
    <TextInput
      placeholder="Search by Code or Name"
      leftSection={<IconSearch size={16} />}
      value={searchInput}
      onChange={(e) => onSearchChange(e.currentTarget.value)}
    />
  );
}
