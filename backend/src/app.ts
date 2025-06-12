// backend/src/app.ts
import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

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

export { app };
