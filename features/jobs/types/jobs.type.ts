export interface Job {
  id: string;
  client_id: string;
  title: string;
  description: string;
  price: number;
  date: string;
  created_at?: string;
}

/** Fila guardada en la tabla job_servicios */
export interface JobServicio {
  id?: number;
  job_id: string;
  servicio_id: number;
  precio: number;
  /** Nombre del servicio (del join con servicios) */
  servicio?: string;
}

/** Estado local en el formulario (antes de guardar) */
export interface JobServicioForm {
  servicio_id: number | null;
  nombre: string;
  precio: number | string;
}
