export interface LoginRequest {
  email?: string;
  password: string;
}

export interface LoginResponse {

  tipo: string;
  imagen: string;// "Bearer"
  mensaje: string;
  nombre: string;// "¡Login exitoso!"
  token: string;   // "eyJhbGci..."
}
