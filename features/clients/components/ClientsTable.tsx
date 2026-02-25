"use client";

import {
  IconDots,
  IconMessages,
  IconNote,
  IconPencil,
  IconTrash,
  IconMail,
  IconPhone,
} from "@tabler/icons-react";
import {
  ActionIcon,
  Anchor,
  Avatar,
  Badge,
  Card,
  Group,
  Menu,
  Stack,
  Table,
  Text,
  VisuallyHidden,
} from "@mantine/core";

import { Client } from "../types/clients.type";

function ActionsMenu() {
  return (
    <Menu
      transitionProps={{ transition: "pop" }}
      withArrow
      position="bottom-end"
      withinPortal
    >
      <Menu.Target>
        <ActionIcon variant="subtle" color="gray" aria-label="Menú">
          <IconDots size={16} stroke={1.5} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item leftSection={<IconMessages size={16} stroke={1.5} />}>
          Enviar mensaje
        </Menu.Item>
        <Menu.Item leftSection={<IconNote size={16} stroke={1.5} />}>
          Agregar nota
        </Menu.Item>
        <Menu.Item
          leftSection={<IconTrash size={16} stroke={1.5} />}
          color="red"
        >
          Eliminar cliente
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

interface ClientsTableProps {
  data: Client[] | null;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ClientsTable({ data }: ClientsTableProps) {
  // --- Vista Desktop: Tabla ---
  const rows = data?.map((item) => (
    <Table.Tr key={item.email}>
      <Table.Td>
        <Group gap="sm">
          <Avatar size={30} radius={30} color="blue">
            {getInitials(item.name)}
          </Avatar>
          <Text fz="sm" fw={500}>
            {item.name}
          </Text>
        </Group>
      </Table.Td>

      <Table.Td>
        <Anchor component="button" size="sm">
          {item.email}
        </Anchor>
      </Table.Td>

      <Table.Td>
        <Text fz="sm">{item.phone}</Text>
      </Table.Td>

      <Table.Td>
        <Group gap={0} justify="flex-end">
          <ActionIcon variant="subtle" color="gray" aria-label="Editar">
            <IconPencil size={16} stroke={1.5} />
          </ActionIcon>
          <ActionsMenu />
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  // --- Vista Mobile: Cards ---
  const cards = data?.map((item) => (
    <Card key={item.email} withBorder padding="md" radius="md">
      <Group justify="space-between" mb="xs">
        <Group gap="sm">
          <Avatar size={40} radius={40} color="blue">
            {getInitials(item.name)}
          </Avatar>
          <div>
            <Text fz="sm" fw={500}>
              {item.name}
            </Text>
          </div>
        </Group>
        <Group gap={4}>
          <ActionIcon variant="subtle" color="gray" aria-label="Editar">
            <IconPencil size={16} stroke={1.5} />
          </ActionIcon>
          <ActionsMenu />
        </Group>
      </Group>

      <Stack gap={4} mt="sm">
        <Group gap="xs">
          <IconMail size={14} stroke={1.5} color="gray" />
          <Anchor component="button" fz="xs">
            {item.email}
          </Anchor>
        </Group>
        <Group gap="xs">
          <IconPhone size={14} stroke={1.5} color="gray" />
          <Text fz="xs" c="dimmed">
            {item.phone}
          </Text>
        </Group>
      </Stack>
    </Card>
  ));

  return (
    <>
      {/* Desktop */}
      <Table.ScrollContainer minWidth={800} visibleFrom="sm">
        <Table verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Cliente</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Teléfono</Table.Th>
              <Table.Th>
                <VisuallyHidden>Acciones</VisuallyHidden>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      {/* Mobile */}
      <Stack hiddenFrom="sm" gap="sm">
        {cards}
      </Stack>
    </>
  );
}
