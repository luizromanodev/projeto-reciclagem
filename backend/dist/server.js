"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const prisma_1 = __importDefault(require("./utils/prisma"));
const PORT = process.env.PORT || 3333; // Define a porta do servidor, usa 3333 como padrão
// Inicia o servidor
app_1.app.listen(PORT, async () => {
    try {
        // Tenta conectar ao banco de dados usando Prisma
        await prisma_1.default.$connect();
        console.log("📦 Banco de dados conectado com sucesso!");
        console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    }
    catch (error) {
        console.error("❌ Falha ao conectar ao banco de dados:", error);
        process.exit(1); // Sai do processo se a conexão falhar
    }
});
