import { Router } from "express";
import CollectionController from "../controllers/CollectionController";
import { authMiddleware, authorizeRoles } from "../middlewares/auth.middleware";
import { UserRole } from "@prisma/client";
import asyncHandler from "../utils/asyncHandler";

const collectionRoutes = Router();

// Rota para agendar uma nova coleta (Cidadão ou Empresa)
// ENVOLVA COM asyncHandler
collectionRoutes.post(
  "/",
  authMiddleware,
  authorizeRoles([UserRole.CITIZEN, UserRole.COMPANY]),
  asyncHandler(CollectionController.scheduleCollection)
);

// Rota para listar coletas (Cidadão/Empresa vê suas próprias, Cooperativa vê agendadas ou atribuídas)
collectionRoutes.get(
  "/",
  authMiddleware,
  asyncHandler(CollectionController.listCollections)
);

// Rota para obter detalhes de uma coleta específica
collectionRoutes.get(
  "/:id",
  authMiddleware,
  asyncHandler(CollectionController.getCollectionById)
);

// Rota para atualizar o status de uma coleta (apenas Cooperativa)
// Inclui atribuição e registro de peso
collectionRoutes.put(
  "/:id/status",
  authMiddleware,
  authorizeRoles([UserRole.COOPERATIVE]),
  asyncHandler(CollectionController.updateCollectionStatus)
);

// Rota para pré-popular materiais (pode ser uma rota temporária para desenvolvimento)
collectionRoutes.post(
  "/seed-materials",
  authMiddleware,
  authorizeRoles([UserRole.COOPERATIVE]), // Geralmente apenas administradores ou cooperativas podem fazer isso
  asyncHandler(CollectionController.seedMaterials)
);

export { collectionRoutes };
