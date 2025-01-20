import { Router } from 'express';
import { addPaymentMethod, getPaymentMethods, deletePaymentMethod } from '../controllers/payment.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authMiddleware, addPaymentMethod);
router.get('/', authMiddleware, getPaymentMethods);
router.delete('/:id', authMiddleware, deletePaymentMethod);

export default router;
