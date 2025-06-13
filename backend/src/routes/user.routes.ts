import { Router } from "express";
import UserController from "../controllers/UserController";
import { authMiddleware, authorizeRoles } from "../middlewares/auth.middleware";
import { UserRole } from "@prisma/client";
import asyncHandler from "../utils/asyncHandler";

const userRoutes = Router();

// Rota para o usuário obter seu próprio perfil (autenticado)
userRoutes.get("/me", authMiddleware, asyncHandler(UserController.getProfile));

// Rota para o usuário atualizar seu próprio perfil (autenticado)
userRoutes.put(
  "/me",
  authMiddleware,
  asyncHandler(UserController.updateProfile)
);

// Rota para listar todos os usuários (apenas para cooperativas)
userRoutes.get(
  "/",
  authMiddleware,
  authorizeRoles([UserRole.COOPERATIVE]),
  asyncHandler(UserController.listUsers)
);

// Rota para obter um usuário específico por ID (apenas para cooperativas)
userRoutes.get(
  "/:id",
  authMiddleware,
  authorizeRoles([UserRole.COOPERATIVE]),
  asyncHandler(UserController.getUserById)
);

export { userRoutes };
