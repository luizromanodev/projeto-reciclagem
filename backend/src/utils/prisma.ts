import { PrismaClient } from "@prisma/client";

// Cria uma única instância do PrismaClient para ser reutilizada
const prisma = new PrismaClient();

export default prisma;
