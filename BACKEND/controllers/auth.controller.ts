import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { hash, compare } from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as  dotenv from 'dotenv';


dotenv.config();

const SECRET: string = process.env.JWT_SECRET || '';
const REFRESH_SECRET: string = process.env.REFRESH_SECRET || '';

const generateAccessToken = (userId: string) => {
    return jwt.sign({ userId }, SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (userId: string) => {
    return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: '7d' });
};

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, lastname, firstname, address, city, postalCode, phone } = req.body;

        // V�rification des donn�es
        if (!email || !password || !lastname || !firstname) {
            return res.status(400).json({ error: 'Tous les champs obligatoires doivent �tre renseign�s.' });
        }

        // V�rification si l'utilisateur existe d�j�
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Un utilisateur avec cet email existe d�j�.' });
        }

        // Hashage du mot de passe
        const hashedPassword = await hash(password, 10);

        // Cr�ation de l'utilisateur
        const user = await prisma.user.create({
            data: {
                lastname,
                firstname,
                email,
                password: hashedPassword,
                address,
                city,
                postalCode,
                phone
            }
        });

        return res.status(201).json({ message: 'Utilisateur cr�� avec succ�s.', userId: user.id });
    } catch (error) {
        return res.status(500).json({ error: `Erreur lors de la cr�ation de l'utilisateur : ${error}` });
    }
};


export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await compare(password, user.password))) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // G�n�rer les tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Stocker le Refresh Token en base
    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: refreshToken }
    });

    res.json({ user, accessToken, refreshToken });
};


export const getMe = async (req: Request, res: Response) => {
    try {
        const userId = req.body.userId;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, lastname: true, firstname: true, address: true, city: true, postalCode: true, phone: true }
        });

        if (!user) {
            return res.status(404).json({ error: "Utilisateur introuvable." });
        }

        return res.json(user);
    } catch (error) {
        return res.status(500).json({ error: `Erreur lors de la r�cup�ration du profil : ${error}` });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, email: true, lastname: true, firstname: true, address: true, city: true, postalCode: true, phone: true }
        });

        return res.json(users);
    } catch (error) {
        return res.status(500).json({ error: `Erreur lors de la r�cup�ration des utilisateurs : ${error}` });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const userId = req.body.id;
        const { lastname, firstname, address, city, postalCode, phone } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { lastname, firstname, address, city, postalCode, phone }
        });

        return res.json({ message: 'Utilisateur mis � jour.', updatedUser });
    } catch (error) {
        return res.status(500).json({ error: `Erreur lors de la mise � jour : ${error}` });
    }
};


export const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = req.body.userId;

        await prisma.user.delete({ where: { id: userId } });

        return res.json({ message: 'Utilisateur supprim� avec succ�s.' });
    } catch (error) {
        return res.status(500).json({ error: `Erreur lors de la suppression : ${error}` });
    }
};

export const logout = async (req: Request, res: Response) => {
    const { userId } = req.body;

    await prisma.user.update({
        where: { id: userId },
        data: { refreshToken: null }
    });

    res.json({ message: 'D�connexion r�ussie' });
};

// Refresh Token

export const refresh = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token manquant' });
    }

    try {
        // V�rifier la validit� du Refresh Token
        const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as { userId: string };

        // R�cup�rer l'utilisateur en base
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ error: 'Refresh token invalide' });
        }

        // G�n�rer un nouveau Access Token et un nouveau Refresh Token
        const newAccessToken = generateAccessToken(user.id);
        const newRefreshToken = generateRefreshToken(user.id);

        // Mettre � jour le Refresh Token en base
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: newRefreshToken }
        });

        res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
        return res.status(403).json({ error: 'Refresh token invalide ou expir�' });
    }
};
