"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectionRoutes = void 0;
// backend/src/routes/collection.routes.ts
const express_1 = require("express");
const CollectionController_1 = __importDefault(require("../controllers/CollectionController"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const client_1 = require("@prisma/client");
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler")); // Importa o asyncHandler
const collectionRoutes = (0, express_1.Router)();
exports.collectionRoutes = collectionRoutes;
// Rota para agendar uma nova coleta (Cidadão ou Empresa)
// ENVOLVA COM asyncHandler
collectionRoutes.post("/", auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorizeRoles)([client_1.UserRole.CITIZEN, client_1.UserRole.COMPANY]), (0, asyncHandler_1.default)(CollectionController_1.default.scheduleCollection) // <-- AQUI!
);
// Rota para listar coletas (Cidadão/Empresa vê suas próprias, Cooperativa vê agendadas ou atribuídas)
// ENVOLVA COM asyncHandler
collectionRoutes.get("/", auth_middleware_1.authMiddleware, (0, asyncHandler_1.default)(CollectionController_1.default.listCollections) // <-- AQUI!
);
// Rota para obter detalhes de uma coleta específica
// ENVOLVA COM asyncHandler
collectionRoutes.get("/:id", auth_middleware_1.authMiddleware, (0, asyncHandler_1.default)(CollectionController_1.default.getCollectionById) // <-- AQUI!
);
// Rota para atualizar o status de uma coleta (apenas Cooperativa)
// Inclui atribuição e registro de peso
// ENVOLVA COM asyncHandler
collectionRoutes.put("/:id/status", auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorizeRoles)([client_1.UserRole.COOPERATIVE]), (0, asyncHandler_1.default)(CollectionController_1.default.updateCollectionStatus) // <-- AQUI!
);
// Rota para pré-popular materiais (pode ser uma rota temporária para desenvolvimento)
// ENVOLVA COM asyncHandler
collectionRoutes.post("/seed-materials", auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorizeRoles)([client_1.UserRole.COOPERATIVE]), // Geralmente apenas administradores ou cooperativas podem fazer isso
(0, asyncHandler_1.default)(CollectionController_1.default.seedMaterials) // <-- AQUI!
);
