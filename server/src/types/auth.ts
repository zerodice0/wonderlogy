export interface User {
  id: number;
  email: string;
  password: string;
  name?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: number;
    email: string;
    name?: string;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
  confirmPassword?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user?: {
    id: number;
    email: string;
    name?: string;
  };
}

export interface JwtPayload {
  userId: number;
  iat?: number;
  exp?: number;
}