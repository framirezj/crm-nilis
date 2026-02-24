import { createClient } from "@/lib/supabase/client";

export async function getJobsByClient(clientId: string) {
  const supabase = createClient();
  return supabase.from("jobs").select("*").eq("client_id", clientId);
}

export async function createJob(data: any) {
  const supabase = createClient();
  return supabase.from("jobs").insert(data);
}

export async function updateJob(id: string, data: any) {
  const supabase = createClient();
  return supabase.from("jobs").update(data).eq("id", id);
}

export async function deleteJob(id: string) {
  const supabase = createClient();
  return supabase.from("jobs").delete().eq("id", id);
}
