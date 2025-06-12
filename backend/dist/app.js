"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
// backend/src/app.ts
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// --- ROTA DE REGISTRO BÁSICA (SEM CONTROLLER OU ASYNCHANDLER POR ENQUANTO) ---
// Apenas para verificar se a rota é registrada pelo Express.
app.post("/api/auth/register", (req, res) => {
    // <<< Simplificado para teste
    console.log("DEBUG: Requisição POST em /api/auth/register recebida!");
    console.log("DEBUG: Body:", req.body);
    res
        .status(200)
        .json({
        message: "Rota de registro básica funcionando!",
        receivedBody: req.body,
    });
});
// -----------------------------------------------------------------------------
// Rota de teste simples (GET)
app.get("/", (req, res) => {
    res.send("API de Gestão de Resíduos está funcionando!");
});
