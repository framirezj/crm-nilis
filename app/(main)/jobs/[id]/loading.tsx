"use client";

import {
  Box,
  Container,
  Flex,
  Group,
  Paper,
  Skeleton,
  Stack,
} from "@mantine/core";

export default function JobDetailsLoading() {
  return (
    <Container size="xl" mt="md">
      {/* Header: Volver + Editar */}
      <Group justify="space-between" mb="md">
        <Skeleton height={32} width={80} radius="sm" />
        <Skeleton height={32} width={100} radius="sm" />
      </Group>

      <Paper shadow="xs" p="xl" withBorder>
        {/* Título + Badge */}
        <Group mb="md">
          <Skeleton height={28} width={220} radius="sm" />
          <Skeleton height={22} width={80} radius="xl" />
        </Group>

        {/* Precio */}
        <Skeleton height={28} width={140} radius="sm" mb={6} />
        <Skeleton height={14} width={100} radius="xl" mb="md" />

        <Flex
          gap="sm"
          direction={{ base: "column", md: "row" }}
          align="flex-start"
        >
          {/* Columna principal: Descripción */}
          <Box w={{ base: "100%", md: "66%" }}>
            <Stack gap="md">
              <Paper withBorder p="md" radius="md">
                <Skeleton height={12} width={140} radius="xl" mb={10} />
                <Skeleton height={12} radius="xl" mb={6} />
                <Skeleton height={12} radius="xl" mb={6} />
                <Skeleton height={12} width="70%" radius="xl" />
              </Paper>
            </Stack>
          </Box>

          {/* Columna lateral: Fecha + Cliente */}
          <Box w={{ base: "100%", md: "34%" }}>
            <Paper withBorder p="md" radius="md">
              <Stack gap="lg">
                {/* Fecha */}
                <Group wrap="nowrap">
                  <Skeleton circle height={24} />
                  <div>
                    <Skeleton height={10} width={100} radius="xl" mb={6} />
                    <Skeleton height={14} width={140} radius="xl" />
                  </div>
                </Group>

                {/* Cliente */}
                <Group wrap="nowrap">
                  <Skeleton circle height={24} />
                  <div>
                    <Skeleton height={10} width={100} radius="xl" mb={6} />
                    <Skeleton height={14} width={120} radius="xl" />
                  </div>
                </Group>
              </Stack>
            </Paper>
          </Box>
        </Flex>
      </Paper>
    </Container>
  );
}
