import { SimpleGrid, Stack, Title, Text } from "@mantine/core";
import { IconUsers, IconBriefcase } from "@tabler/icons-react";
import { createClient } from "@/lib/supabase/server";
import {
  getTotalClients,
  getMonthlyJobsCount,
  getRevenueLastSixMonths,
  getRecentJobs,
} from "@/features/dashboard/services/dashboard.service";
import { StatCard } from "@/features/dashboard/components/StatCard";
import { RevenueChart } from "@/features/dashboard/components/RevenueChart";
import { RecentJobsTable } from "@/features/dashboard/components/RecentJobsTable";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [totalClients, monthlyJobsCount, revenueData, recentJobs] =
    await Promise.all([
      getTotalClients(supabase),
      getMonthlyJobsCount(supabase),
      getRevenueLastSixMonths(supabase),
      getRecentJobs(supabase),
    ]);

  const currentMonth = new Date().toLocaleDateString("es-CL", {
    month: "long",
    year: "numeric",
  });

  return (
    <Stack gap="lg">
      <div>
        <Title order={2}>Dashboard</Title>
        <Text c="dimmed" size="sm">
          Resumen general del negocio
        </Text>
      </div>

      {/* Stat cards */}
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <StatCard
          label="Total de clientes"
          value={totalClients}
          icon={IconUsers}
          color="blue"
          description="Clientes registrados"
        />
        <StatCard
          label="Servicios este mes"
          value={monthlyJobsCount}
          icon={IconBriefcase}
          color="teal"
          description={`Trabajos en ${currentMonth}`}
        />
      </SimpleGrid>

      {/* Revenue chart */}
      <RevenueChart data={revenueData} />

      {/* Recent jobs */}
      <RecentJobsTable jobs={recentJobs} />
    </Stack>
  );
}
