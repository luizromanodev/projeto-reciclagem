// backend/src/routes/collection.routes.ts
import { Router } from "express";
import CollectionController from "../controllers/CollectionController";
import { authMiddleware, authorizeRoles } from "../middlewares/auth.middleware";
import { UserRole } from "@prisma/client";
import asyncHandler from "../utils/asyncHandler"; // Importa o asyncHandler

const collectionRoutes = Router();

// Rota para agendar uma nova coleta (Cidadão ou Empresa)
// ENVOLVA COM asyncHandler
collectionRoutes.post(
  "/",
  authMiddleware,
  authorizeRoles([UserRole.CITIZEN, UserRole.COMPANY]),
  asyncHandler(CollectionController.scheduleCollection) // <-- AQUI!
);

// Rota para listar coletas (Cidadão/Empresa vê suas próprias, Cooperativa vê agendadas ou atribuídas)
// ENVOLVA COM asyncHandler
collectionRoutes.get(
  "/",
  authMiddleware,
  asyncHandler(CollectionController.listCollections) // <-- AQUI!
);

// Rota para obter detalhes de uma coleta específica
// ENVOLVA COM asyncHandler
collectionRoutes.get(
  "/:id",
  authMiddleware,
  asyncHandler(CollectionController.getCollectionById) // <-- AQUI!
);

// Rota para atualizar o status de uma coleta (apenas Cooperativa)
// Inclui atribuição e registro de peso
// ENVOLVA COM asyncHandler
collectionRoutes.put(
  "/:id/status",
  authMiddleware,
  authorizeRoles([UserRole.COOPERATIVE]),
  asyncHandler(CollectionController.updateCollectionStatus) // <-- AQUI!
);

// Rota para pré-popular materiais (pode ser uma rota temporária para desenvolvimento)
// ENVOLVA COM asyncHandler
collectionRoutes.post(
  "/seed-materials",
  authMiddleware,
  authorizeRoles([UserRole.COOPERATIVE]), // Geralmente apenas administradores ou cooperativas podem fazer isso
  asyncHandler(CollectionController.seedMaterials) // <-- AQUI!
);

export { collectionRoutes };
