"use client";

import { Table, Text } from "@mantine/core";
import type { JobServicio } from "../types/jobs.type";

interface JobServiciosTableProps {
  servicios: JobServicio[];
  total: number;
}

function formatCLP(value: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function JobServiciosTable({
  servicios,
  total,
}: JobServiciosTableProps) {
  if (servicios.length === 0) {
    return (
      <Text size="sm" c="dimmed">
        Sin servicios registrados
      </Text>
    );
  }

  return (
    <Table verticalSpacing="xs">
      <Table.Tbody>
        {servicios.map((s, i) => (
          <Table.Tr key={i}>
            <Table.Td>
              <Text size="sm">{s.servicio}</Text>
            </Table.Td>
            <Table.Td ta="right">
              <Text size="sm" fw={500}>
                {formatCLP(s.precio)}
              </Text>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
      <Table.Tfoot>
        <Table.Tr>
          <Table.Td>
            <Text fw={700} size="sm">
              Total
            </Text>
          </Table.Td>
          <Table.Td ta="right">
            <Text fw={700} size="sm" c="blue.7">
              {formatCLP(total)}
            </Text>
          </Table.Td>
        </Table.Tr>
      </Table.Tfoot>
    </Table>
  );
}
