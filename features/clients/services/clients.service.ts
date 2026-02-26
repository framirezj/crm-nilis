export async function getClients(supabase: any) {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function createClient(supabase: any, data: any) {
  return supabase.from("clients").insert(data);
}

export async function getClientById(supabase: any, id: string) {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateClient(supabase: any, id: string, data: any) {
  return supabase.from("clients").update(data).eq("id", id);
}

export async function deleteClient(supabase: any, id: string) {
  return supabase.from("clients").delete().eq("id", id);
}
