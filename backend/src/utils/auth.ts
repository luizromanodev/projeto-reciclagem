import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Garante que JWT_SECRET seja carregado do .env ou use um fallback (apenas para ambiente de desenvolvimento se o .env falhar)
const JWT_SECRET =
  process.env.JWT_SECRET || "fallback_secret_nao_usar_em_producao";

// Gera um token JWT
export const generateToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" }); // Token expira em 1 dia
};

// Verifica um token JWT
export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};

// Faz o hash de uma senha
export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10); // 10 é o número de rounds de salting, um bom valor padrão
};

// Compara uma senha em texto puro com uma senha hasheada
export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(password, hashedPassword);
};
