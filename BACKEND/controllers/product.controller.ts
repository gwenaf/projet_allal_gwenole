import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getProducts = async (_req: Request, res: Response) => {
    const products = await prisma.product.findMany();
    res.json(products);
};

export const getProduct = async (req: Request, res: Response) => {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!product) return res.status(404).json({ error: 'Produit introuvable' });
    res.json(product);
};

export const addProduct = async (req: Request, res: Response) => {
    const { name, description, price, stock } = req.body;
    const product = await prisma.product.create({ data: { name, description, price, stock } });
    res.json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
    const product = await prisma.product.update({
        where: { id: req.params.id },
        data: req.body
    });
    res.json(product);
};

export const deleteProduct = async (req: Request, res: Response) => {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ message: 'Produit supprimé' });
};
