import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

const SECRET_KEY = process.env.ENCRYPTION_KEY as string; // 32 caractères pour AES-256
const IV_LENGTH = 16; // Taille du vecteur d'initialisation

export const encryptCard = (cardNumber: string): string => {
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv('aes-256-cbc', Buffer.from(SECRET_KEY), iv);
    let encrypted = cipher.update(cardNumber, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
};

export const decryptCard = (encryptedData: string): string => {
    const parts = encryptedData.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = Buffer.from(parts[1], 'hex');
    const decipher = createDecipheriv('aes-256-cbc', Buffer.from(SECRET_KEY), iv);
    let decrypted = decipher.update(encryptedText).toString('utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};
