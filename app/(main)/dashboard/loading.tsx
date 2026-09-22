import { SimpleGrid, Skeleton, Stack } from "@mantine/core";

export default function DashboardLoading() {
  return (
    <Stack gap="lg">
      {/* Título */}
      <div>
        <Skeleton height={28} width={140} radius="sm" mb={8} />
        <Skeleton height={14} width={220} radius="sm" />
      </div>

      {/* Stat cards */}
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <Skeleton height={100} radius="md" />
        <Skeleton height={100} radius="md" />
      </SimpleGrid>

      {/* Revenue chart */}
      <Skeleton height={340} radius="md" />

      {/* Recent jobs table */}
      <Skeleton height={260} radius="md" />
    </Stack>
  );
}
