// backend/src/app.ts
import "dotenv/config"; // Importante para carregar as variáveis de ambiente do .env primeiro
import express from "express";
import cors from "cors"; // Importa o CORS para permitir requisições do frontend
import { routes } from "./routes"; // Importa o arquivo de rotas principal

const app = express();

app.use(cors()); // Habilita o CORS para todas as rotas (permite que o frontend em outro domínio acesse o backend)
app.use(express.json()); // Habilita o Express para parsear JSON do corpo das requisições

// Prefixo /api para todas as rotas da API
app.use("/api", routes); // Usa o arquivo de rotas principal com o prefixo /api

// Rota de teste simples
app.get("/", (req, res) => {
  res.send("API de Gestão de Resíduos está funcionando!");
});

export { app };
