import { createClient } from "@/lib/supabase/server";
import { getClientById } from "@/features/clients/services/clients.service";

export default async function ClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const client = await getClientById(supabase, id);

  return (
    <div>
      <h1>{client?.name}</h1>
    </div>
  );
}
