"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AuthService_1 = __importDefault(require("../services/AuthService"));
const client_1 = require("@prisma/client");
const zod_1 = require("zod"); // Para validação de dados
class AuthController {
    constructor() {
        // Mude para arrow function
        Object.defineProperty(this, "register", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (req, res) => {
                try {
                    // Acesse o schema usando AuthController.registerSchema
                    const validatedData = AuthController.registerSchema.parse(req.body);
                    const { name, email, password, role, phone, address, latitude, longitude, } = validatedData;
                    const { user, token } = await AuthService_1.default.register(name, email, password, role, phone, address, latitude, longitude);
                    return res.status(201).json({ user, token });
                }
                catch (error) {
                    if (error instanceof zod_1.z.ZodError) {
                        // Erros de validação do Zod
                        return res
                            .status(400)
                            .json({ message: "Erro de validação.", errors: error.errors });
                    }
                    // Outros erros do AuthService
                    return res.status(400).json({ message: error.message });
                }
            }
        });
        // Mude para arrow function
        Object.defineProperty(this, "login", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (req, res) => {
                try {
                    // Acesse o schema usando AuthController.loginSchema
                    const validatedData = AuthController.loginSchema.parse(req.body);
                    const { email, password } = validatedData;
                    const { user, token } = await AuthService_1.default.login(email, password);
                    return res.status(200).json({ user, token });
                }
                catch (error) {
                    if (error instanceof zod_1.z.ZodError) {
                        // Erros de validação do Zod
                        return res
                            .status(400)
                            .json({ message: "Erro de validação.", errors: error.errors });
                    }
                    // Outros erros do AuthService
                    return res.status(401).json({ message: error.message });
                }
            }
        });
    }
}
// Mova os schemas para dentro da classe como propriedades estáticas
Object.defineProperty(AuthController, "registerSchema", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: zod_1.z
        .object({
        name: zod_1.z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
        email: zod_1.z.string().email("Formato de email inválido."),
        password: zod_1.z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
        role: zod_1.z.nativeEnum(client_1.UserRole, { message: "Papel de usuário inválido." }), // Garante que o papel seja um dos enums definidos
        phone: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
        latitude: zod_1.z.number().optional(),
        longitude: zod_1.z.number().optional(),
    })
        .strict("Campos adicionais não são permitidos no registro.")
}); // Impede campos extras no payload
Object.defineProperty(AuthController, "loginSchema", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: zod_1.z
        .object({
        email: zod_1.z.string().email("Formato de email inválido."),
        password: zod_1.z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
    })
        .strict("Campos adicionais não são permitidos no login.")
});
exports.default = new AuthController(); // Continua exportando uma instância
