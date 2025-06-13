import { app } from "./app";
import prisma from "./utils/prisma";

const PORT = process.env.PORT || 3333;

app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log("📦 Banco de dados conectado com sucesso!");
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  } catch (error) {
    console.error("❌ Falha ao conectar ao banco de dados:", error);
    process.exit(1);
  }
});
