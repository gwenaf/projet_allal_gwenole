"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || 'supersecret';
exports.default = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token)
        return res.status(401).json({ error: 'Acc�s refus�' });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, SECRET);
        req.userId = decoded.userId;
        next();
    }
    catch (_b) {
        res.status(401).json({ error: 'Token invalide' });
    }
};
//# sourceMappingURL=auth.middleware.js.map