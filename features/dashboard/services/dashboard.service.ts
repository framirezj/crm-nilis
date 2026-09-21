import { RecentJob, RevenueDataPoint } from "../types/dashboard.types";

// ──────────────────────────────────────────────
// Total de clientes registrados
// ──────────────────────────────────────────────
export async function getTotalClients(supabase: any): Promise<number> {
  const { count, error } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true });

  if (error) throw new Error(error.message);
  return count ?? 0;
}

// ──────────────────────────────────────────────
// Cantidad de jobs cuyo campo `date` está en el mes en curso
// ──────────────────────────────────────────────
export async function getMonthlyJobsCount(supabase: any): Promise<number> {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  // Primer y último día del mes actual en formato YYYY-MM-DD
  const from = `${year}-${month}-01`;
  const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
  const to = `${year}-${month}-${String(lastDay).padStart(2, "0")}`;

  const { count, error } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true })
    .gte("date", from)
    .lte("date", to);

  if (error) throw new Error(error.message);
  return count ?? 0;
}

// ──────────────────────────────────────────────
// Ingresos totales de los últimos 6 meses (campo `date`)
// Devuelve un array de { month: "Sep 2026", revenue: 50000 }
// garantizando los 6 meses aunque alguno esté vacío
// ──────────────────────────────────────────────
export async function getRevenueLastSixMonths(
  supabase: any
): Promise<RevenueDataPoint[]> {
  const now = new Date();

  // Construir los 6 rangos mensuales (de más antiguo a más nuevo)
  const months: { label: string; from: string; to: string }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const lastDay = new Date(year, d.getMonth() + 1, 0).getDate();

    const label = d.toLocaleDateString("es-CL", {
      month: "short",
      year: "numeric",
    });

    months.push({
      label,
      from: `${year}-${month}-01`,
      to: `${year}-${month}-${String(lastDay).padStart(2, "0")}`,
    });
  }

  // Fetch todos los jobs de los 6 meses en una sola query
  const { data, error } = await supabase
    .from("jobs")
    .select("date, price")
    .gte("date", months[0].from)
    .lte("date", months[months.length - 1].to);

  if (error) throw new Error(error.message);

  // Agrupar y sumar por mes
  return months.map(({ label, from, to }) => {
    const revenue = (data ?? [])
      .filter((job: { date: string; price: number }) => {
        return job.date >= from && job.date <= to;
      })
      .reduce(
        (sum: number, job: { date: string; price: number }) =>
          sum + (job.price ?? 0),
        0
      );

    return { month: label, revenue };
  });
}

// ──────────────────────────────────────────────
// Últimos 3 trabajos realizados, con nombre del cliente
// ──────────────────────────────────────────────
export async function getRecentJobs(supabase: any): Promise<RecentJob[]> {
  const { data, error } = await supabase
    .from("jobs")
    .select("id, title, price, date, clients(name)")
    .order("date", { ascending: false })
    .limit(3);

  if (error) throw new Error(error.message);

  return (data ?? []).map((job: any) => ({
    id: job.id,
    title: job.title,
    price: job.price,
    date: job.date,
    client_name: job.clients?.name ?? "—",
  }));
}
