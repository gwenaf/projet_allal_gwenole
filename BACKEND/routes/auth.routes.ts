import { Router } from 'express';
import { login, register, getMe, refresh, logout, updateUser } from '../controllers/auth.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);
router.post('/refresh', authMiddleware, refresh);
router.post('/logout', authMiddleware, logout);
router.put('/update', authMiddleware, updateUser);

export default router;