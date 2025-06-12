"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes")); // <<< MUDE AQUI (sem chaves, para default import)!
const user_routes_1 = require("./user.routes");
const collection_routes_1 = require("./collection.routes");
const routes = (0, express_1.Router)();
exports.routes = routes;
routes.use("/auth", auth_routes_1.default); // Continua usando assim
routes.use("/users", user_routes_1.userRoutes);
routes.use("/collections", collection_routes_1.collectionRoutes);
