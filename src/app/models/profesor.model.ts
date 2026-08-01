export interface ProfesorModel {
  id?: number;
  identificacion: string;
  nombre: string;
  apellido: string;
  email?: string;
  telefono: string;
  imagenUrl?: string;
  porcentajeComision: number;
}
