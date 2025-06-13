import "dotenv/config";
import express from "express";
import cors from "cors";
import { routes } from "./routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

// Rota de teste simples
app.get("/", (req, res) => {
  res.send("API de Gestão de Resíduos está funcionando!");
});

export { app };
