import type { JobServicioForm } from "../types/jobs.type";

export async function getJobsByClient(supabase: any, clientId: string) {
  return supabase
    .from("jobs")
    .select("*")
    .eq("client_id", clientId)
    .order("date", { ascending: false });
}

export async function getJobById(supabase: any, id: string) {
  const jobResult = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id);

  if (jobResult.error || !jobResult.data?.length) return jobResult;

  // Traer los servicios asociados con join al catálogo
  const serviciosResult = await supabase
    .from("job_servicios")
    .select("id, servicio_id, precio, servicios(servicio)")
    .eq("job_id", id);

  return {
    ...jobResult,
    data: jobResult.data.map((job: any) => ({
      ...job,
      job_servicios: (serviciosResult.data ?? []).map((js: any) => ({
        id: js.id,
        servicio_id: js.servicio_id,
        precio: js.precio,
        servicio: js.servicios?.servicio ?? "",
      })),
    })),
  };
}

/**
 * Crea un job y sus servicios asociados en una sola operación.
 * El precio total se calcula sumando los precios de los servicios.
 */
export async function createJob(
  supabase: any,
  data: {
    client_id: string;
    title: string;
    description: string;
    date: string;
    servicios: JobServicioForm[];
  }
) {
  const total = data.servicios.reduce(
    (sum, s) => sum + (Number(s.precio) || 0),
    0
  );

  // 1. Insertar el job
  const { data: newJob, error: jobError } = await supabase
    .from("jobs")
    .insert({
      client_id: data.client_id,
      title: data.title,
      description: data.description,
      date: data.date,
      price: total,
    })
    .select()
    .single();

  if (jobError) return { error: jobError };

  // 2. Insertar los servicios asociados
  const rows = data.servicios.map((s) => ({
    job_id: newJob.id,
    servicio_id: s.servicio_id,
    precio: Number(s.precio) || 0,
  }));

  const { error: serviciosError } = await supabase
    .from("job_servicios")
    .insert(rows);

  if (serviciosError) return { error: serviciosError };

  return { data: newJob, error: null };
}

/**
 * Actualiza un job y reemplaza sus servicios (delete + re-insert).
 */
export async function updateJob(
  supabase: any,
  id: string,
  data: {
    client_id: string;
    title: string;
    description: string;
    date: string;
    servicios: JobServicioForm[];
  }
) {
  const total = data.servicios.reduce(
    (sum, s) => sum + (Number(s.precio) || 0),
    0
  );

  // 1. Actualizar el job
  const { error: jobError } = await supabase
    .from("jobs")
    .update({
      title: data.title,
      description: data.description,
      date: data.date,
      price: total,
    })
    .eq("id", id);

  if (jobError) return { error: jobError };

  // 2. Borrar los servicios anteriores y reinsertar
  const { error: deleteError } = await supabase
    .from("job_servicios")
    .delete()
    .eq("job_id", id);

  if (deleteError) return { error: deleteError };

  const rows = data.servicios.map((s) => ({
    job_id: id,
    servicio_id: s.servicio_id,
    precio: Number(s.precio) || 0,
  }));

  const { error: insertError } = await supabase
    .from("job_servicios")
    .insert(rows);

  return { error: insertError ?? null };
}

export async function deleteJob(supabase: any, id: string) {
  return supabase.from("jobs").delete().eq("id", id);
}
