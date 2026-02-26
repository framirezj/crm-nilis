import { Title, Group } from "@mantine/core";
import ClientsTable from "@/features/clients/components/ClientsTable";
import { getClients } from "@/features/clients/services/clients.service";
import AddClientButton from "@/features/clients/components/AddClientButton";
import { createClient } from "@/lib/supabase/server";

export default function ClientsPage() {
  return (
    <div>
      <Group justify="space-between" mb="lg" p="lg">
        <Title order={2}>Clientes</Title>
        <AddClientButton />
      </Group>
      <ClientsPageContent />
    </div>
  );
}

async function ClientsPageContent() {
  const supabase = await createClient();
  const clients = await getClients(supabase);
  return <ClientsTable data={clients} />;
}
