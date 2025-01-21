import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
    console.error("ERREUR: JWT_SECRET est manquant !");
    process.exit(1);
}

// Étendre l'interface Request pour ajouter `userId`
interface AuthRequest extends Request {
    userId?: string;
}

export default (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Accès refusé' });
    }

    try {
        const decoded = jwt.verify(token, SECRET as string) as jwt.JwtPayload;

        if (!decoded || typeof decoded !== 'object' || !decoded.userId) {
            return res.status(401).json({ error: 'Token invalide' });
        }

        req.userId = decoded.userId;
        next();
    } catch (error) {
        const errorMessage: string = "Token invalide" + error;
        res.status(401).json({ error: errorMessage });
    }
};
