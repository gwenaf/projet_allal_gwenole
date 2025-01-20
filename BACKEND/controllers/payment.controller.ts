import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { encryptCard, decryptCard } from '../utils/encryption';

export const addPaymentMethod = async (req: Request, res: Response) => {
    const { cardNumber, type } = req.body;

    if (!cardNumber || cardNumber.length < 16) {
        return res.status(400).json({ error: "Numéro de carte invalide" });
    }

    const encryptedCard = encryptCard(cardNumber);
    const last4 = cardNumber.slice(-4);

    const paymentMethod = await prisma.paymentMethod.create({
        data: {
            userId: req.body.userId,
            type,
            last4,
            encryptedData: encryptedCard
        }
    });

    res.json({ message: "Carte ajoutée", paymentMethod });
};

export const getPaymentMethods = async (req: Request, res: Response) => {
    const paymentMethods = await prisma.paymentMethod.findMany({
        where: { userId: req.body.userId },
        select: { id: true, type: true, last4: true, createdAt: true }
    });

    res.json(paymentMethods);
};

export const deletePaymentMethod = async (req: Request, res: Response) => {
    await prisma.paymentMethod.delete({ where: { id: req.params.id, userId: req.body.userId } });
    res.json({ message: "Carte supprimée" });
};
