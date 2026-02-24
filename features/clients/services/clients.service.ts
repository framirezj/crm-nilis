// features/clients/services/clients.service.ts

import { createClient as createSupabaseClient } from "@/lib/supabase/client";

export async function getClients() {
  const supabase = createSupabaseClient();
  return supabase.from("clients").select("*").order("created_at");
}

export async function createClient(data: any) {
  const supabase = createSupabaseClient();
  return supabase.from("clients").insert(data);
}

export async function updateClient(id: string, data: any) {
  const supabase = createSupabaseClient();
  return supabase.from("clients").update(data).eq("id", id);
}

export async function deleteClient(id: string) {
  const supabase = createSupabaseClient();
  return supabase.from("clients").delete().eq("id", id);
}
