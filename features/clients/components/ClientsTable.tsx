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
  Avatar,
  Card,
  Group,
  Menu,
  Stack,
  Table,
  Text,
} from "@mantine/core";

// Datos de ejemplo – luego se reemplazarán con datos reales de Supabase
const data = [
  {
    name: "María González",
    company: "Tech Solutions",
    email: "maria@techsolutions.cl",
    phone: "+56 9 1234 5678",
  },
  {
    name: "Carlos Pérez",
    company: "Diseño Creativo",
    email: "carlos@disenocreativo.cl",
    phone: "+56 9 8765 4321",
  },
  {
    name: "Ana Rodríguez",
    company: "Marketing Digital",
    email: "ana@mktdigital.cl",
    phone: "+56 9 5555 1234",
  },
  {
    name: "Juan Martínez",
    company: "Constructora JM",
    email: "juan@constructorajm.cl",
    phone: "+56 9 4444 5678",
  },
  {
    name: "Sofía López",
    company: "Consultora SL",
    email: "sofia@consultorasl.cl",
    phone: "+56 9 3333 9876",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

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

export default function ClientsTable() {
  // --- Vista Desktop: Tabla ---
  const rows = data.map((item) => (
    <Table.Tr key={item.email}>
      <Table.Td>
        <Group gap="sm">
          <Avatar size={40} radius={40} color="violet">
            {getInitials(item.name)}
          </Avatar>
          <div>
            <Text fz="sm" fw={500}>
              {item.name}
            </Text>
            <Text c="dimmed" fz="xs">
              {item.company}
            </Text>
          </div>
        </Group>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{item.email}</Text>
        <Text fz="xs" c="dimmed">
          Email
        </Text>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{item.phone}</Text>
        <Text fz="xs" c="dimmed">
          Teléfono
        </Text>
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
  const cards = data.map((item) => (
    <Card key={item.email} withBorder padding="md" radius="md">
      <Group justify="space-between" mb="xs">
        <Group gap="sm">
          <Avatar size={40} radius={40} color="violet">
            {getInitials(item.name)}
          </Avatar>
          <div>
            <Text fz="sm" fw={500}>
              {item.name}
            </Text>
            <Text c="dimmed" fz="xs">
              {item.company}
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
          <Text fz="xs" c="dimmed">
            {item.email}
          </Text>
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
        <Table verticalSpacing="md">
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
