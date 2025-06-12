"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = __importDefault(require("../controllers/AuthController"));
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const authRoutes = (0, express_1.Router)();
authRoutes.post("/register", (0, asyncHandler_1.default)(AuthController_1.default.register));
authRoutes.post("/login", (0, asyncHandler_1.default)(AuthController_1.default.login));
// Mude o export. Deixe de ser named export e vire default export.
exports.default = authRoutes; // <<< MUDE AQUI!
