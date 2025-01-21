"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("../controllers/payment.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post('/', auth_middleware_1.default, payment_controller_1.addPaymentMethod);
router.get('/', auth_middleware_1.default, payment_controller_1.getPaymentMethods);
router.delete('/:id', auth_middleware_1.default, payment_controller_1.deletePaymentMethod);
exports.default = router;
//# sourceMappingURL=payment.routes.js.map