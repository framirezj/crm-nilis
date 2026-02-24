// features/clients/services/clients.service.ts

import { supabase } from "@/lib/supabase/supabaseClient";

export async function getClients() {
  return supabase.from("clients").select("*").order("created_at");
}

export async function createClient(data: any) {
  return supabase.from("clients").insert(data);
}

export async function updateClient(id: string, data: any) {
  return supabase.from("clients").update(data).eq("id", id);
}

export async function deleteClient(id: string) {
  return supabase.from("clients").delete().eq("id", id);
}
