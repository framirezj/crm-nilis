export async function getJobsByClient(supabase: any, clientId: string) {
  return supabase.from("jobs").select("*").eq("client_id", clientId);
}

export async function createJob(supabase: any, data: any) {
  return supabase.from("jobs").insert(data);
}

export async function updateJob(supabase: any, id: string, data: any) {
  return supabase.from("jobs").update(data).eq("id", id);
}

export async function deleteJob(supabase: any, id: string) {
  return supabase.from("jobs").delete().eq("id", id);
}
