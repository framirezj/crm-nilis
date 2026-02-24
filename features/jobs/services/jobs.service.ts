import { supabase } from "@/lib/supabase/supabaseClient";

export async function getJobsByClient(clientId: string) {
  return supabase.from("jobs").select("*").eq("client_id", clientId);
}

export async function createJob(data: any) {
  return supabase.from("jobs").insert(data);
}

export async function updateJob(id: string, data: any) {
  return supabase.from("jobs").update(data).eq("id", id);
}

export async function deleteJob(id: string) {
  return supabase.from("jobs").delete().eq("id", id);
}
