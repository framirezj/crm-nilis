import { Title, Group, Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import ClientsTable from "@/features/clients/components/ClientsTable";
import { getClients } from "@/features/clients/services/clients.service";

export default function ClientsPage() {
  return (
    <div>
      <Group justify="space-between" mb="lg" p="lg">
        <Title order={2}>Clientes</Title>
        <Button leftSection={<IconPlus size={16} />}>Nuevo cliente</Button>
      </Group>
      <ClientsPageContent />
    </div>
  );
}

async function ClientsPageContent() {
  const clients = await getClients();
  return <ClientsTable data={clients} />;
}
