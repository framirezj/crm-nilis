"use client";

import { TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

interface ClientsSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ClientsSearchBar({
  value,
  onChange,
}: ClientsSearchBarProps) {
  return (
    <TextInput
      placeholder="Buscar por nombre..."
      leftSection={<IconSearch size={16} stroke={1.5} />}
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
      mx="lg"
      mb="sm"
    />
  );
}
