export interface DashboardStats {
  totalClients: number;
  monthlyJobsCount: number;
}

export interface RevenueDataPoint {
  month: string; // "Sep 2026"
  revenue: number; // en CLP
}

export interface RecentJob {
  id: string;
  title: string;
  client_name: string;
  price: number;
  date: string;
}
