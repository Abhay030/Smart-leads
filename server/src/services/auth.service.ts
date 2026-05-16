import { User } from '../models/User';
import { AppError } from '../middleware/errorHandler';
import { signToken } from '../utils/jwt';
import { RegisterDto, LoginDto, AuthResponse, UserPublic } from '../types/user.types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toPublicUser(user: {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'sales';
  createdAt: Date;
}): UserPublic {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

// ─── Register ─────────────────────────────────────────────────────────────────

export async function registerUser(dto: RegisterDto): Promise<AuthResponse> {
  // Check for existing email before creating — gives a clean 409 instead of
  // a Mongoose duplicate key error (which leaks schema details)
  const existing = await User.findOne({ email: dto.email.toLowerCase() });
  if (existing) {
    throw new AppError('An account with this email already exists', 409);
  }

  const user = await User.create({
    name: dto.name,
    email: dto.email,
    password: dto.password, // hashed by pre-save hook
    role: dto.role ?? 'sales',
  });

  const token = signToken({
    userId: user.id as string,
    email: user.email,
    role: user.role,
  });

  return {
    token,
    user: toPublicUser({
      id: user.id as string,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    }),
  };
}

// ─── Login ────────────────────────────────────────────────────────────────────

export async function loginUser(dto: LoginDto): Promise<AuthResponse> {
  // select('+password') because password has select: false on the schema
  const user = await User.findOne({ email: dto.email.toLowerCase() }).select('+password');

  // Use the same error message for missing user AND wrong password
  // to prevent user enumeration attacks
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isPasswordMatch = await user.comparePassword(dto.password);
  if (!isPasswordMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = signToken({
    userId: user.id as string,
    email: user.email,
    role: user.role,
  });

  return {
    token,
    user: toPublicUser({
      id: user.id as string,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    }),
  };
}

// ─── Demo Login ───────────────────────────────────────────────────────────────

export async function demoLoginUser(): Promise<AuthResponse> {
  const demoEmail = 'demo@servicehive.com';
  const user = await User.findOne({ email: demoEmail });

  if (!user) {
    throw new AppError('Demo workspace is currently unavailable. Please try again later.', 503);
  }

  const token = signToken({
    userId: user.id as string,
    email: user.email,
    role: user.role,
  });

  return {
    token,
    user: toPublicUser({
      id: user.id as string,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    }),
  };
}

// ─── Get Current User ─────────────────────────────────────────────────────────

export async function getUserById(userId: string): Promise<UserPublic> {
  const user = await User.findById(userId);

  if (!user) {
    // This should be rare — would only happen if the user was deleted after JWT was issued
    throw new AppError('User not found', 404);
  }

  return toPublicUser({
    id: user.id as string,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  });
}
