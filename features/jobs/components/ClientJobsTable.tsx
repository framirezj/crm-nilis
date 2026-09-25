"use client";

import { Table, Text, Card, Group, Stack, Button } from "@mantine/core";
import Link from "next/link";
import { Job } from "../types/jobs.type";
import { IconTrash } from "@tabler/icons-react";
import { deleteJob } from "../services/jobs.service";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useCallback } from "react";

interface ClientJobsTableProps {
  data: Job[] | null;
}

export default function ClientJobsTable({
  data,
}: ClientJobsTableProps) {
  const supabase = createClient();
  const router = useRouter();

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
            await deleteJob(supabase, id);
            notifications.show({
              title: "Trabajo eliminado",
              message: `"${title}" fue eliminado correctamente.`,
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

  if (!data || data.length === 0) {
    return (
      <Text c="dimmed" mt="md">
        No hay trabajos registrados para este cliente.
      </Text>
    );
  }

  // --- Vista Desktop: Tabla ---
  const rows = data.map((item) => (
    <Table.Tr key={item.id}>
      <Table.Td>
        <Text fz="sm" fw={500}>
          {item.title}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">
          {item.price != null
            ? new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
              }).format(item.price)
            : "-"}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">
          {item.date
            ? new Intl.DateTimeFormat("es-CL", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                timeZone: "UTC",
              })
                .format(new Date(item.date))
                .replace(/\//g, "-")
            : "-"}
        </Text>
      </Table.Td>
      <Table.Td>
        {/* Aquí puedes agregar un menú de acciones similar al de clientes */}
        <Group gap="xs">
          <Button
            component={Link}
            href={`/jobs/${item.id}`}
            variant="light"
            size="xs"
          >
            Ver detalles
          </Button>
          <Button
            variant="light"
            size="xs"
            color="red"
            onClick={() => handleDelete(item.id, item.title)}
          >
            <IconTrash size={16} stroke={1.5} />
          </Button>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  // --- Vista Mobile: Cards ---
  const cards = data.map((item) => (
    <Card key={item.id} withBorder padding="md" radius="md">
      <Group justify="space-between" mb="xs">
        <Text fz="sm" fw={500}>
          {item.title}
        </Text>
        <Text fz="xs" c="dimmed">
          {item.price != null
            ? new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
              }).format(item.price)
            : "-"}
        </Text>
      </Group>
      <Stack gap={4}>
        <Text fz="xs" c="dimmed">
          Fecha:{" "}
          {item.date
            ? new Intl.DateTimeFormat("es-CL", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                timeZone: "UTC",
              })
                .format(new Date(item.date))
                .replace(/\//g, "-")
            : "-"}
        </Text>
        <Button
          component={Link}
          href={`/jobs/${item.id}`}
          variant="light"
          size="xs"
        >
          Ver detalles
        </Button>
      </Stack>
    </Card>
  ));

  return (
    <>
      <Table.ScrollContainer minWidth={600} visibleFrom="sm" mt="md">
        <Table verticalSpacing="sm" striped>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Trabajo</Table.Th>
              <Table.Th>Precio</Table.Th>
              <Table.Th>Fecha de Creación</Table.Th>
              <Table.Th>Acciones</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      <Stack hiddenFrom="sm" gap="sm" mt="md">
        {cards}
      </Stack>
    </>
  );
}
