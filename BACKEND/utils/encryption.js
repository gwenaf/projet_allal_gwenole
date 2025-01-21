"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptCard = exports.encryptCard = void 0;
const crypto_1 = require("crypto");
const SECRET_KEY = process.env.ENCRYPTION_KEY; // 32 caract�res pour AES-256
const IV_LENGTH = 16; // Taille du vecteur d'initialisation
const encryptCard = (cardNumber) => {
    const iv = (0, crypto_1.randomBytes)(IV_LENGTH);
    const cipher = (0, crypto_1.createCipheriv)('aes-256-cbc', Buffer.from(SECRET_KEY), iv);
    let encrypted = cipher.update(cardNumber, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
};
exports.encryptCard = encryptCard;
const decryptCard = (encryptedData) => {
    const parts = encryptedData.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = Buffer.from(parts[1], 'hex');
    const decipher = (0, crypto_1.createDecipheriv)('aes-256-cbc', Buffer.from(SECRET_KEY), iv);
    let decrypted = decipher.update(encryptedText).toString('utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};
exports.decryptCard = decryptCard;
//# sourceMappingURL=encryption.js.map