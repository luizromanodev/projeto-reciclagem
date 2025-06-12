import { Router } from "express";
import AuthController from "../controllers/AuthController";
import asyncHandler from "../utils/asyncHandler";

const authRoutes = Router();

authRoutes.post("/register", asyncHandler(AuthController.register));
authRoutes.post("/login", asyncHandler(AuthController.login));

// Mude o export. Deixe de ser named export e vire default export.
export default authRoutes; // <<< MUDE AQUI!
