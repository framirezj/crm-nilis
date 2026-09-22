import type { SupabaseClient } from "@supabase/supabase-js";
import type { ServicioFormValues } from "../types/servicios.types";

export async function getServicios(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("servicios")
    .select("*")
    .order("categoria", { ascending: true })
    .order("servicio", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Devuelve las categorías únicas para el Combobox creatable */
export async function getCategorias(
  supabase: SupabaseClient,
): Promise<string[]> {
  const { data, error } = await supabase.from("servicios").select("categoria");

  if (error) throw new Error(error.message);

  const unique = [
    ...new Set((data ?? []).map((row: { categoria: string }) => row.categoria)),
  ];
  return unique.sort();
}

export async function createServicio(
  supabase: SupabaseClient,
  values: ServicioFormValues,
) {
  const { error } = await supabase.from("servicios").insert(values);
  if (error) throw new Error(error.message);
}

export async function updateServicio(
  supabase: SupabaseClient,
  id: number,
  values: ServicioFormValues,
) {
  const { error } = await supabase
    .from("servicios")
    .update(values)
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteServicio(supabase: SupabaseClient, id: number) {
  const { error } = await supabase.from("servicios").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
