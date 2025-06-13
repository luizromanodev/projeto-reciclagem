// backend/src/routes/materials.routes.ts
import { Router } from "express";
import asyncHandler from "../utils/asyncHandler";
import MaterialController from "../controllers/MaterialController";

const materialsRoutes = Router();

materialsRoutes.get("/", asyncHandler(MaterialController.listMaterials)); // <<< AQUI!
export { materialsRoutes };
