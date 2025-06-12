"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../utils/prisma"));
const auth_1 = require("../utils/auth");
class UserService {
    async findUserById(id) {
        const user = await prisma_1.default.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                address: true,
                latitude: true,
                longitude: true,
                createdAt: true,
                updatedAt: true,
            }, // Excluir senha
        });
        if (!user) {
            throw new Error("Usuário não encontrado.");
        }
        return user;
    }
    async updateUser(id, data) {
        if (data.password) {
            data.password = await (0, auth_1.hashPassword)(data.password); // Faz hash da nova senha se fornecida
        }
        const updatedUser = await prisma_1.default.user.update({
            where: { id },
            data: { ...data },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                address: true,
                latitude: true,
                longitude: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return updatedUser;
    }
    async listUsers(role) {
        const users = await prisma_1.default.user.findMany({
            where: role ? { role } : {},
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                address: true,
                latitude: true,
                longitude: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return users;
    }
}
exports.default = new UserService();
