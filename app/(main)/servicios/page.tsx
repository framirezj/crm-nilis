import { createClient } from "@/lib/supabase/server";
import {
  getServicios,
  getCategorias,
} from "@/features/servicios/services/servicios.service";
import ServiciosTable from "@/features/servicios/components/ServiciosTable";

export default async function ServiciosPage() {
  const supabase = await createClient();

  const [servicios, categorias] = await Promise.all([
    getServicios(supabase),
    getCategorias(supabase),
  ]);

  return <ServiciosTable data={servicios} categorias={categorias} />;
}
