// ─── User Role ────────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'sales';

// ─── Public User Shape (safe to return in API responses) ─────────────────────

export interface UserPublic {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

// ─── Auth Response ────────────────────────────────────────────────────────────

export interface AuthResponse {
  token: string;
  user: UserPublic;
}

// ─── DTOs ─────────────────────────────────────────────────────────────────────

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginDto {
  email: string;
  password: string;
}

// ─── JWT Payload ──────────────────────────────────────────────────────────────

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}
