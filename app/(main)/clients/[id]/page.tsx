import { createClient } from "@/lib/supabase/server";
import { getClientById } from "@/features/clients/services/clients.service";
import { getJobsByClient } from "@/features/jobs/services/jobs.service";
import ClientJobsTable from "@/features/jobs/components/ClientJobsTable";
import { Title, Container, Paper } from "@mantine/core";

export default async function ClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Usamos Promise.all para cargar el cliente y sus trabajos en paralelo
  const [client, { data: jobs }] = await Promise.all([
    getClientById(supabase, id),
    getJobsByClient(supabase, id),
  ]);

  return (
    <Container size="xl" mt="md">
      <Paper shadow="xs" p="md" mb="xl" withBorder>
        <Title order={2}>{client?.name}</Title>
      </Paper>

      <Title order={3} mb="md">
        Trabajos del Cliente
      </Title>
      <ClientJobsTable data={jobs} />
    </Container>
  );
}
