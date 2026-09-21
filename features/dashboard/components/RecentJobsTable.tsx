"use client";

import {
  Paper,
  Table,
  Text,
  Title,
  Badge,
  Group,
  Anchor,
} from "@mantine/core";
import Link from "next/link";
import type { RecentJob } from "../types/dashboard.types";

interface RecentJobsTableProps {
  jobs: RecentJob[];
}

function formatCLP(value: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function RecentJobsTable({ jobs }: RecentJobsTableProps) {
  return (
    <Paper withBorder p="lg" radius="md">
      <Group justify="space-between" mb="md">
        <div>
          <Title order={5}>Últimos trabajos</Title>
          <Text size="xs" c="dimmed">
            Los 3 trabajos más recientes
          </Text>
        </div>
        <Anchor component={Link} href="/clients" size="sm">
          Ver todos →
        </Anchor>
      </Group>

      {jobs.length === 0 ? (
        <Text c="dimmed" size="sm" ta="center" py="xl">
          No hay trabajos registrados aún.
        </Text>
      ) : (
        <Table verticalSpacing="sm" striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Trabajo</Table.Th>
              <Table.Th>Cliente</Table.Th>
              <Table.Th ta="right">Precio</Table.Th>
              <Table.Th ta="right">Fecha</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {jobs.map((job) => (
              <Table.Tr key={job.id}>
                <Table.Td>
                  <Anchor
                    component={Link}
                    href={`/jobs/${job.id}`}
                    size="sm"
                    fw={500}
                  >
                    {job.title}
                  </Anchor>
                </Table.Td>
                <Table.Td>
                  <Badge variant="light" color="gray" size="sm">
                    {job.client_name}
                  </Badge>
                </Table.Td>
                <Table.Td ta="right">
                  <Text size="sm" fw={600} c="blue.6">
                    {formatCLP(job.price)}
                  </Text>
                </Table.Td>
                <Table.Td ta="right">
                  <Text size="sm" c="dimmed">
                    {formatDate(job.date)}
                  </Text>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </Paper>
  );
}
