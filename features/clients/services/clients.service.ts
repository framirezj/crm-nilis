interface GetClientsParams {
  supabase: any;
  page?: number; // Página actual (base 1: 1, 2, 3...)
  pageSize?: number; // Cantidad por página (default: 10 o 20)
  searchTerm?: string; // Término de búsqueda opcional
}

export async function getClients({
  supabase,
  page = 1,
  pageSize = 10,
  searchTerm = "",
}: GetClientsParams) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("clients")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (searchTerm.trim()) {
    query = query.ilike("name", `%${searchTerm.trim()}%`);
  }

  const { data, error, count } = await query;

  if (error) throw new Error(error.message);

  const total = count ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  return {
    data: data ?? [],
    total,
    page,
    pageSize,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
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
