"use client";

import { useState, useCallback } from "react";
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
  Pagination,
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
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import { createClient } from "@/lib/supabase/client";
import { deleteClient } from "../services/clients.service";

interface ClientsTableProps {
  data: Client[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  currentSearch: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ClientsTable({
  data,
  totalPages,
  page,
  currentSearch,
}: ClientsTableProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [search, setSearch] = useState(currentSearch);
  const router = useRouter();
  const supabase = createClient();

  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      params.set("page", String(newPage));
      router.push(`/clients?${params.toString()}`);
    },
    [router, search],
  );

  const handleDelete = useCallback(
    (id: string, title: string) => {
      modals.openConfirmModal({
        title: "Eliminar trabajo",
        centered: true,
        children: (
          <Text size="sm">
            ¿Estás seguro que querés eliminar el trabajo{" "}
            <strong>{title}</strong>? Esta acción no se puede deshacer.
          </Text>
        ),
        labels: { confirm: "Eliminar", cancel: "Cancelar" },
        confirmProps: { color: "red" },
        onConfirm: async () => {
          try {
            await deleteClient(supabase, id);
            notifications.show({
              title: "Cliente eliminado",
              message: `\"${title}\" fue eliminado correctamente.`,
              color: "green",
            });
            router.refresh();
          } catch {
            notifications.show({
              title: "Error",
              message: "No se pudo eliminar el trabajo. Intentá de nuevo.",
              color: "red",
            });
          }
        },
      });
    },
    [router, supabase],
  );

  const handleSearch = useCallback(
    (value: string) => {
      setSearch(value);
      const params = new URLSearchParams();
      if (value) params.set("search", value);
      params.set("page", "1");
      router.push(`/clients?${params.toString()}`);
    },
    [router],
  );

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
  const rows = data.map((item) => (
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
        <Group gap={0} justify="flex-start">
          <ActionIcon
            variant="subtle"
            color="gray"
            aria-label="Editar"
            onClick={() => handleEdit(item)}
          >
            <IconPencil size={16} stroke={1.5} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="red"
            aria-label="Eliminar"
            onClick={() => handleDelete(item.id, item.name)}
          >
            <IconTrash size={16} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  // --- Vista Mobile: Cards ---
  const cards = data.map((item) => (
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
          <ActionIcon
            variant="subtle"
            color="red"
            aria-label="Eliminar"
            onClick={() => handleDelete(item.id, item.name)}
          >
            <IconTrash size={16} stroke={1.5} />
          </ActionIcon>
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
        {search
          ? `No se encontraron clientes para "${search}"`
          : "No hay clientes registrados"}
      </Text>
    </Center>
  );

  return (
    <>
      <ClientsSearchBar value={search} onChange={handleSearch} />

      {/* Desktop */}
      <Table.ScrollContainer minWidth={800} visibleFrom="sm">
        <Table verticalSpacing="sm" striped>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Cliente</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Teléfono</Table.Th>
              <Table.Th>Acciones</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.length === 0 ? (
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
        {data.length === 0 ? emptyState : cards}
      </Stack>

      {/* Paginación */}
      {totalPages > 1 && (
        <Group justify="center" mt="xl" mb="md">
          <Pagination
            total={totalPages}
            value={page}
            onChange={handlePageChange}
          />
        </Group>
      )}

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
