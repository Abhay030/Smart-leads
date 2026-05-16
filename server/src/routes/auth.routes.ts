import { Router } from 'express';
import { register, login, me, demoLogin } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { registerValidator, loginValidator } from '../validators/auth.validator';
import { validate } from '../middleware/validate';

const router = Router();

// ─── Public Routes ────────────────────────────────────────────────────────────

// POST /api/auth/register
router.post('/register', registerValidator, validate, register);

// POST /api/auth/login
router.post('/login', loginValidator, validate, login);

// POST /api/auth/demo-login
router.post('/demo-login', demoLogin);

// ─── Protected Routes ─────────────────────────────────────────────────────────

// GET /api/auth/me
router.get('/me', authMiddleware, me);

export default router;
