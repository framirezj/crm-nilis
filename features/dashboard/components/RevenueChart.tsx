"use client";

import { Paper, Text, Title } from "@mantine/core";
import { BarChart } from "@mantine/charts";
import type { RevenueDataPoint } from "../types/dashboard.types";

interface RevenueChartProps {
  data: RevenueDataPoint[];
}

function formatCLP(value: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Paper withBorder p="lg" radius="md">
      <Title order={5} mb="xs">
        Ingresos últimos 6 meses
      </Title>
      <Text size="xs" c="dimmed" mb="lg">
        Suma de precios de trabajos por mes
      </Text>
      <BarChart
        h={260}
        data={data}
        dataKey="month"
        series={[{ name: "revenue", color: "blue.6", label: "Ingresos" }]}
        tickLine="y"
        gridAxis="y"
        withTooltip
        tooltipProps={{
          content: ({ payload }) => {
            if (!payload?.length) return null;
            const { month, revenue } = payload[0].payload as RevenueDataPoint;
            return (
              <Paper px="md" py="sm" withBorder shadow="sm" radius="md">
                <Text size="sm" fw={500}>
                  {month}
                </Text>
                <Text size="sm" c="blue.6" fw={700}>
                  {formatCLP(revenue)}
                </Text>
              </Paper>
            );
          },
        }}
        yAxisProps={{
          tickFormatter: (v: number) =>
            new Intl.NumberFormat("es-CL", {
              notation: "compact",
              compactDisplay: "short",
            }).format(v),
        }}
      />
    </Paper>
  );
}
