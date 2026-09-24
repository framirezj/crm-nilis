"use client";

import { TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

interface ServicioSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ServicioSearchBar({
  value,
  onChange,
}: ServicioSearchBarProps) {
  return (
    <TextInput
      placeholder="Buscar servicio"
      leftSection={<IconSearch size={16} stroke={1.5} />}
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
      mx="lg"
      mb="sm"
    />
  );
}
