// backend/src/routes/index.ts
import { Router } from "express";
import { userRoutes } from "./user.routes";
import { collectionRoutes } from "./collection.routes";
import { materialsRoutes } from "./materials.routes"; // <<< IMPORTAÇÃO AQUI
import authRoutes from "./auth.routes";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/users", userRoutes);
routes.use("/collections", collectionRoutes);
routes.use("/materials", materialsRoutes); // <<< USO DA ROTA AQUI
export { routes };
