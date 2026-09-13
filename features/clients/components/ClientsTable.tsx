"use client";

import { useState } from "react";
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
  Card,
  Center,
  Group,
  Menu,
  Stack,
  Table,
  Text,
  VisuallyHidden,
  Modal,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Client } from "../types/clients.type";
import ClientForm from "./ClientForm";
import ClientsSearchBar from "./ClientsSearchBar";

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
  const [opened, { open, close }] = useDisclosure(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [search, setSearch] = useState("");
  const router = useRouter();


  const filtered =
    data?.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())) ??
    [];

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    open();
  };

  const handleSuccess = () => {
    close();
    setEditingClient(null);
    router.refresh();
  };
  // --- Vista Desktop: Tabla ---
  const rows = filtered.map((item) => (
    <Table.Tr key={item.id}>
      <Table.Td>
        <Group gap="sm">
          <Avatar
            size={30}
            radius={30}
            color="blue"
            component={Link}
            href={`/clients/${item.id}`}
            style={{ cursor: "pointer" }}
          >
            {getInitials(item.name)}
          </Avatar>
          <Text
            fz="sm"
            fw={500}
            component={Link}
            href={`/clients/${item.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
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
          <ActionIcon
            variant="subtle"
            color="gray"
            aria-label="Editar"
            onClick={() => handleEdit(item)}
          >
            <IconPencil size={16} stroke={1.5} />
          </ActionIcon>
          <ActionsMenu />
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  // --- Vista Mobile: Cards ---
  const cards = filtered.map((item) => (
    <Card key={item.id} withBorder padding="md" radius="md">
      <Group justify="space-between" mb="xs">
        <Group gap="sm">
          <Avatar
            size={40}
            radius={40}
            color="blue"
            component={Link}
            href={`/clients/${item.id}`}
          >
            {getInitials(item.name)}
          </Avatar>
          <div>
            <Text
              fz="sm"
              fw={500}
              component={Link}
              href={`/clients/${item.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {item.name}
            </Text>
          </div>
        </Group>
        <Group gap={4}>
          <ActionIcon
            variant="subtle"
            color="gray"
            aria-label="Editar"
            onClick={() => handleEdit(item)}
          >
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

  const emptyState = (
    <Center py="xl">
      <Text c="dimmed" fz="sm">
        No se encontraron clientes para &ldquo;{search}&rdquo;
      </Text>
    </Center>
  );

  return (
    <>
      <ClientsSearchBar value={search} onChange={setSearch} />

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
          <Table.Tbody>
            {filtered.length === 0 && search ? (
              <Table.Tr>
                <Table.Td colSpan={4}>{emptyState}</Table.Td>
              </Table.Tr>
            ) : (
              rows
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      {/* Mobile */}
      <Stack hiddenFrom="sm" gap="sm" px="lg">
        {filtered.length === 0 && search ? emptyState : cards}
      </Stack>

      <Modal opened={opened} onClose={close} title="Editar Cliente" centered>
        <ClientForm
          initialData={editingClient}
          onSuccess={handleSuccess}
          onCancel={close}
        />
      </Modal>
    </>
  );
}
