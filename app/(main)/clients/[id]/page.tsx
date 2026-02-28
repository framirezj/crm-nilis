import { createClient } from "@/lib/supabase/server";
import { getClientById } from "@/features/clients/services/clients.service";
import { getJobsByClient } from "@/features/jobs/services/jobs.service";
import ClientJobsTable from "@/features/jobs/components/ClientJobsTable";
import { Title, Container, Paper, Button, Group } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import AddJobButton from "@/features/jobs/components/AddJobButton";

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
      <Button
        component="a"
        href={`/clients`}
        variant="subtle"
        leftSection={<IconArrowLeft size={16} />}
        mb="md"
        px={0}
      >
        Volver
      </Button>

      <Group justify="space-between" align="center" mb="md">
        <Title order={2} c="dimmed">
          Cliente: {client?.name}
        </Title>
        <AddJobButton clientId={id} />
      </Group>
      <ClientJobsTable data={jobs} />
    </Container>
  );
}
