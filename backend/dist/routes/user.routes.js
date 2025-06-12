"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
// backend/src/routes/user.routes.ts
const express_1 = require("express");
const UserController_1 = __importDefault(require("../controllers/UserController"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const client_1 = require("@prisma/client");
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler")); // Importa o asyncHandler
const userRoutes = (0, express_1.Router)();
exports.userRoutes = userRoutes;
// Rota para o usuário obter seu próprio perfil (autenticado)
// ENVOLVA COM asyncHandler
userRoutes.get("/me", auth_middleware_1.authMiddleware, (0, asyncHandler_1.default)(UserController_1.default.getProfile));
// Rota para o usuário atualizar seu próprio perfil (autenticado)
// ENVOLVA COM asyncHandler
userRoutes.put("/me", auth_middleware_1.authMiddleware, (0, asyncHandler_1.default)(UserController_1.default.updateProfile));
// Rota para listar todos os usuários (apenas para cooperativas)
// ENVOLVA COM asyncHandler
userRoutes.get("/", auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorizeRoles)([client_1.UserRole.COOPERATIVE]), (0, asyncHandler_1.default)(UserController_1.default.listUsers));
// Rota para obter um usuário específico por ID (apenas para cooperativas)
// ENVOLVA COM asyncHandler
userRoutes.get("/:id", auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorizeRoles)([client_1.UserRole.COOPERATIVE]), (0, asyncHandler_1.default)(UserController_1.default.getUserById));
