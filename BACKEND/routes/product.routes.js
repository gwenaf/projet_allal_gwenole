"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get('/', product_controller_1.getProducts);
router.get('/:id', product_controller_1.getProduct);
router.post('/', auth_middleware_1.default, product_controller_1.addProduct);
router.put('/:id', auth_middleware_1.default, product_controller_1.updateProduct);
router.delete('/:id', auth_middleware_1.default, product_controller_1.deleteProduct);
exports.default = router;
//# sourceMappingURL=product.routes.js.map