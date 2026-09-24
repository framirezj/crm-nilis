import { createClient } from "@/lib/supabase/server";
import { getClientById } from "@/features/clients/services/clients.service";
import { getJobsByClient } from "@/features/jobs/services/jobs.service";
import { getServicios } from "@/features/servicios/services/servicios.service";
import ClientJobsTable from "@/features/jobs/components/ClientJobsTable";
import { Title, Container, Button, Group } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import AddJobButton from "@/features/jobs/components/AddJobButton";
import Link from "next/link";

export default async function ClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [client, { data: jobs }, catalogoServicios] = await Promise.all([
    getClientById(supabase, id),
    getJobsByClient(supabase, id),
    getServicios(supabase),
  ]);

  return (
    <Container size="xl" mt="md">
      <Link href="/clients" style={{ textDecoration: "none" }}>
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
          mb="md"
          px={0}
        >
          Volver
        </Button>
      </Link>

      <Group justify="space-between" align="center" mb="md">
        <Title order={2} c="dimmed">
          Cliente: {client?.name}
        </Title>
        <AddJobButton clientId={id} catalogoServicios={catalogoServicios} />
      </Group>
      <ClientJobsTable data={jobs} />
    </Container>
  );
}

