"use client";

import { Group, Skeleton, Stack, Table } from "@mantine/core";

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <Table.Tr key={i}>
          <Table.Td>
            <Group gap="sm">
              <Skeleton circle height={30} />
              <Skeleton height={12} width={130} radius="xl" />
            </Group>
          </Table.Td>
          <Table.Td>
            <Skeleton height={12} width={170} radius="xl" />
          </Table.Td>
          <Table.Td>
            <Skeleton height={12} width={100} radius="xl" />
          </Table.Td>
          <Table.Td>
            <Group justify="flex-end">
              <Skeleton height={24} width={56} radius="sm" />
            </Group>
          </Table.Td>
        </Table.Tr>
      ))}
    </>
  );
}

export default function ClientsLoading() {
  return (
    <>
      {/* Tabla skeleton — Desktop */}
      <Table.ScrollContainer minWidth={800} visibleFrom="sm">
        <Table verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>
                <Skeleton height={12} width={60} radius="xl" />
              </Table.Th>
              <Table.Th>
                <Skeleton height={12} width={40} radius="xl" />
              </Table.Th>
              <Table.Th>
                <Skeleton height={12} width={70} radius="xl" />
              </Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <SkeletonRows />
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      {/* Cards skeleton — Mobile */}
      <Stack hiddenFrom="sm" gap="sm" px="lg">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} height={90} radius="md" />
        ))}
      </Stack>
    </>
  );
}
