// backend/src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/auth";
import { UserRole } from "@prisma/client";

// Importante: O 'declare global' para Express.Request DEVE estar APENAS em src/types/express.d.ts
// Não deve haver um 'declare global' aqui neste arquivo!

// Middleware para verificar a autenticação via JWT
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // <<<<< ADICIONADO : void AQUI!
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      message: "Token de autenticação não fornecido ou formato inválido.",
    });
    return; // <<<<< Garante que a função termina aqui
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = verifyToken(token); // O verifyToken deve retornar um objeto com id e role
    req.userId = decoded.id;
    req.userRole = decoded.role as UserRole; // Fazer um cast explícito pode ajudar aqui também
    next(); // Chama next() para passar o controle para o próximo middleware/rota
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      res.status(401).json({ message: "Token expirado." });
    } else {
      res.status(401).json({ message: "Token inválido." });
    }
    return; // <<<<< Garante que a função termina aqui em caso de erro
  }
};

// Middleware para verificar autorização baseada em papéis
export const authorizeRoles = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // <<<<< ADICIONADO : void AQUI!
    if (!req.userRole || !roles.includes(req.userRole)) {
      res.status(403).json({
        message: "Acesso negado: você não tem permissão para esta ação.",
      });
      return; // <<<<< Garante que a função termina aqui
    }
    next(); // Chama next() para passar o controle
  };
};
