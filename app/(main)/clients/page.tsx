import { Title, Group } from "@mantine/core";
import ClientsTable from "@/features/clients/components/ClientsTable";
import { getClients } from "@/features/clients/services/clients.service";
import AddClientButton from "@/features/clients/components/AddClientButton";
import { createClient } from "@/lib/supabase/server";

interface ClientsPageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function ClientsPage({ searchParams }: ClientsPageProps) {
  const supabase = await createClient();
  const { page: pageParam, search: searchParam } = await searchParams;

  const page = Math.max(1, Number(pageParam ?? 1));
  const search = searchParam ?? "";

  const result = await getClients({
    supabase,
    page,
    //pageSize: 10,
    searchTerm: search,
  });

  return (
    <div>
      <Group justify="space-between" mb="lg" p="lg">
        <Title order={2}>Clientes</Title>
        <AddClientButton />
      </Group>
      <ClientsTable
        data={result.data}
        total={result.total}
        page={result.page}
        pageSize={result.pageSize}
        totalPages={result.totalPages}
        currentSearch={search}
      />
    </div>
  );
}
