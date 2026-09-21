import { Paper, Text, Group, ThemeIcon, Stack } from "@mantine/core";
import type { Icon } from "@tabler/icons-react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: Icon;
  color: string;
  description?: string;
}

export function StatCard({
  label,
  value,
  icon: IconComponent,
  color,
  description,
}: StatCardProps) {
  return (
    <Paper withBorder p="lg" radius="md">
      <Group justify="space-between" align="flex-start">
        <Stack gap={4}>
          <Text size="sm" c="dimmed" fw={500}>
            {label}
          </Text>
          <Text size="2.2rem" fw={700} lh={1}>
            {value}
          </Text>
          {description && (
            <Text size="xs" c="dimmed">
              {description}
            </Text>
          )}
        </Stack>
        <ThemeIcon size="xl" radius="md" color={color} variant="light">
          <IconComponent size={24} stroke={1.5} />
        </ThemeIcon>
      </Group>
    </Paper>
  );
}
