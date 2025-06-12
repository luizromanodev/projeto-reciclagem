"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Garante que JWT_SECRET seja carregado do .env ou use um fallback (apenas para ambiente de desenvolvimento se o .env falhar)
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_nao_usar_em_producao";
// Gera um token JWT
const generateToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: "1d" }); // Token expira em 1 dia
};
exports.generateToken = generateToken;
// Verifica um token JWT
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
};
exports.verifyToken = verifyToken;
// Faz o hash de uma senha
const hashPassword = async (password) => {
    return await bcryptjs_1.default.hash(password, 10); // 10 é o número de rounds de salting, um bom valor padrão
};
exports.hashPassword = hashPassword;
// Compara uma senha em texto puro com uma senha hasheada
const comparePassword = async (password, hashedPassword) => {
    return await bcryptjs_1.default.compare(password, hashedPassword);
};
exports.comparePassword = comparePassword;
