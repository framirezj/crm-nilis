"use client";

import { Group, Skeleton, Stack, Table } from "@mantine/core";

export default function ServiciosLoading() {
  return (
    <>
      {/* Header skeleton */}
      <Group justify="space-between" mb="lg" px="lg">
        <Skeleton height={32} width={120} radius="sm" />
        <Skeleton height={36} width={150} radius="sm" />
      </Group>

      {/* Tabla skeleton — Desktop */}
      <Table.ScrollContainer minWidth={500} visibleFrom="sm">
        <Table verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th><Skeleton height={12} width={70} radius="xl" /></Table.Th>
              <Table.Th><Skeleton height={12} width={80} radius="xl" /></Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {Array.from({ length: 6 }).map((_, i) => (
              <Table.Tr key={i}>
                <Table.Td><Skeleton height={12} width={160} radius="xl" /></Table.Td>
                <Table.Td><Skeleton height={20} width={80} radius="xl" /></Table.Td>
                <Table.Td>
                  <Group justify="flex-end" gap={4}>
                    <Skeleton circle height={28} />
                    <Skeleton circle height={28} />
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      {/* Cards skeleton — Mobile */}
      <Stack hiddenFrom="sm" gap="sm" px="lg">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} height={72} radius="md" />
        ))}
      </Stack>
    </>
  );
}
