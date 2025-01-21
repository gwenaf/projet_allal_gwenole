import { Router } from 'express';
import { login, register, getMe, refresh, logout } from '../controllers/auth.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);
router.post('/refresh', authMiddleware, refresh);
router.post('/logout', authMiddleware, logout);

export default router;