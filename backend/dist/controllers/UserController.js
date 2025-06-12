"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserService_1 = __importDefault(require("../services/UserService"));
const zod_1 = require("zod");
class UserController {
    constructor() {
        Object.defineProperty(this, "getProfile", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (req, res) => {
                try {
                    if (!req.userId) {
                        return res
                            .status(401)
                            .json({ message: "ID do usuário não encontrado na requisição." });
                    }
                    const user = await UserService_1.default.findUserById(req.userId);
                    return res.status(200).json(user);
                }
                catch (error) {
                    return res.status(404).json({ message: error.message });
                }
            }
        });
        Object.defineProperty(this, "updateProfile", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (req, res) => {
                try {
                    if (!req.userId) {
                        return res
                            .status(401)
                            .json({ message: "ID do usuário não encontrado na requisição." });
                    }
                    // Acesse o schema usando UserController.updateUserSchema
                    const validatedData = UserController.updateUserSchema.parse(req.body);
                    const updatedUser = await UserService_1.default.updateUser(req.userId, validatedData);
                    return res.status(200).json(updatedUser);
                }
                catch (error) {
                    if (error instanceof zod_1.z.ZodError) {
                        return res
                            .status(400)
                            .json({ message: "Erro de validação.", errors: error.errors });
                    }
                    return res.status(400).json({ message: error.message });
                }
            }
        });
        Object.defineProperty(this, "listUsers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (req, res) => {
                try {
                    const role = req.query.role;
                    const users = await UserService_1.default.listUsers(role);
                    return res.status(200).json(users);
                }
                catch (error) {
                    return res
                        .status(500)
                        .json({ message: "Erro ao listar usuários.", error: error.message });
                }
            }
        });
        Object.defineProperty(this, "getUserById", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (req, res) => {
                try {
                    const { id } = req.params;
                    const user = await UserService_1.default.findUserById(id);
                    return res.status(200).json(user);
                }
                catch (error) {
                    return res.status(404).json({ message: error.message });
                }
            }
        });
    }
}
// Mova o schema para dentro da classe como propriedade estática
Object.defineProperty(UserController, "updateUserSchema", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: zod_1.z
        .object({
        name: zod_1.z.string().min(3).optional(),
        email: zod_1.z.string().email().optional(),
        password: zod_1.z.string().min(6).optional(),
        phone: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
        latitude: zod_1.z.number().optional(),
        longitude: zod_1.z.number().optional(),
    })
        .strict("Campos adicionais não são permitidos na atualização do usuário.")
});
exports.default = new UserController();
