export interface Servicio {
  id: number;
  created_at: string;
  servicio: string;
  categoria: string;
}

export interface ServicioFormValues {
  servicio: string;
  categoria: string;
}
