export interface Job {
  id?: string;
  client_id: string;
  title: string;
  description: string;
  price: number;
  date: string;
  created_at?: string;
}
