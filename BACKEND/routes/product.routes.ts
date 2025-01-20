import { Router } from 'express';
import { getProducts, getProduct, addProduct, updateProduct, deleteProduct } from '../controllers/product.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', authMiddleware, addProduct);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

export default router;
