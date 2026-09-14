"use client";

import { Table, Text, Card, Group, Stack, Button } from "@mantine/core";
import Link from "next/link";
import { Job } from "../types/jobs.type";

interface ClientJobsTableProps {
  data: Job[] | null;
}

export default function ClientJobsTable({ data }: ClientJobsTableProps) {
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
        <Button
          component={Link}
          href={`/jobs/${item.id}`}
          variant="light"
          size="xs"
        >
          Ver detalles
        </Button>
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
