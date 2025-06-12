import { app } from "./app";
import prisma from "./utils/prisma";

const PORT = process.env.PORT || 3333; // Define a porta do servidor, usa 3333 como padrão

// Inicia o servidor
app.listen(PORT, async () => {
  try {
    // Tenta conectar ao banco de dados usando Prisma
    await prisma.$connect();
    console.log("📦 Banco de dados conectado com sucesso!");
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  } catch (error) {
    console.error("❌ Falha ao conectar ao banco de dados:", error);
    process.exit(1); // Sai do processo se a conexão falhar
  }
});
