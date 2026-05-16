import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { sendSuccess, sendCreated } from '../utils/apiResponse';
import { registerUser, loginUser, getUserById, demoLoginUser } from '../services/auth.service';
import { RegisterDto, LoginDto } from '../types/user.types';

// ─── POST /api/auth/register ──────────────────────────────────────────────────

export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const dto = req.body as RegisterDto;
  const result = await registerUser(dto);
  sendCreated(res, result, 'Registration successful');
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────

export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const dto = req.body as LoginDto;
  const result = await loginUser(dto);
  sendSuccess(res, result, 'Login successful');
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────

export const me = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // req.user is guaranteed here — authMiddleware runs before this controller
  const user = await getUserById(req.user!.id);
  sendSuccess(res, user, 'User retrieved');
});

// ─── POST /api/auth/demo-login ────────────────────────────────────────────────

export const demoLogin = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const result = await demoLoginUser();
  sendSuccess(res, result, 'Welcome to the Demo Workspace');
});
