export interface LoginRequest {
  email?: string;
  password: string;
}

export interface LoginResponse {
  tipo: string;    // "Bearer"
  mensaje: string; // "¡Login exitoso!"
  token: string;   // "eyJhbGci..."
}
