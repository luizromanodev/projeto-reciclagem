import { Router } from "express";
import { userRoutes } from "./user.routes";
import { collectionRoutes } from "./collection.routes";
import { materialsRoutes } from "./materials.routes";
import authRoutes from "./auth.routes";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/users", userRoutes);
routes.use("/collections", collectionRoutes);
routes.use("/materials", materialsRoutes);
export { routes };
