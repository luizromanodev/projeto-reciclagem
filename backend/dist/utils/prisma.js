"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
// Cria uma única instância do PrismaClient para ser reutilizada
const prisma = new client_1.PrismaClient();
exports.default = prisma;
