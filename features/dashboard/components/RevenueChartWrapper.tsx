"use client";

import dynamic from "next/dynamic";
import type { RevenueDataPoint } from "../types/dashboard.types";

// ssr:false solo se puede usar en Client Components.
// Este wrapper permite que el Server Component (page.tsx) importe el chart
// sin generar errores de hidratación por la dependencia de Recharts en window.
const RevenueChart = dynamic(
  () =>
    import("@/features/dashboard/components/RevenueChart").then(
      (m) => m.RevenueChart
    ),
  { ssr: false }
);

export function RevenueChartWrapper({ data }: { data: RevenueDataPoint[] }) {
  return <RevenueChart data={data} />;
}
