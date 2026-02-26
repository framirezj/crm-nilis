export interface Job {
  id?: string;
  client_id: string;
  title: string;
  description: string;
  price: number;
  created_at?: string;
}
