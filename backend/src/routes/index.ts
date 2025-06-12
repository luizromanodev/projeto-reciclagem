import { Router } from "express";
import authRoutes from "./auth.routes"; // <<< MUDE AQUI (sem chaves, para default import)!
import { userRoutes } from "./user.routes";
import { collectionRoutes } from "./collection.routes";

const routes = Router();

routes.use("/auth", authRoutes); // Continua usando assim
routes.use("/users", userRoutes);
routes.use("/collections", collectionRoutes);

export { routes };
