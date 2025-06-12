"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../utils/prisma"));
const auth_1 = require("../utils/auth");
class AuthService {
    async register(name, email, password_raw, role, phone, address, latitude, longitude) {
        // 1. Verifica se o usuário já existe
        const existingUser = await prisma_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error("Usuário com este email já existe.");
        }
        // 2. Faz o hash da senha antes de salvar
        const password = await (0, auth_1.hashPassword)(password_raw);
        // 3. Cria o usuário no banco de dados
        const user = await prisma_1.default.user.create({
            data: {
                name,
                email,
                password,
                role,
                phone,
                address,
                latitude,
                longitude,
            },
        });
        // 4. Gera um token JWT para o novo usuário
        const token = (0, auth_1.generateToken)({ id: user.id, role: user.role });
        // Retorna informações do usuário (sem a senha) e o token
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                address: user.address,
                latitude: user.latitude,
                longitude: user.longitude,
            },
            token,
        };
    }
    async login(email, password_raw) {
        // 1. Busca o usuário pelo email
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user) {
            throw new Error("Credenciais inválidas: Email ou senha incorretos.");
        }
        // 2. Compara a senha fornecida com a senha hasheada no banco
        const passwordMatch = await (0, auth_1.comparePassword)(password_raw, user.password);
        if (!passwordMatch) {
            throw new Error("Credenciais inválidas: Email ou senha incorretos.");
        }
        // 3. Gera um token JWT para o usuário logado
        const token = (0, auth_1.generateToken)({ id: user.id, role: user.role });
        // Retorna informações do usuário (sem a senha) e o token
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                address: user.address,
                latitude: user.latitude,
                longitude: user.longitude,
            },
            token,
        };
    }
}
exports.default = new AuthService();
