import { Request, Response } from "express";
import AuthService from "../services/AuthService";
import { UserRole } from "@prisma/client";
import { z } from "zod"; // Para validação de dados

class AuthController {
  // Mova os schemas para dentro da classe como propriedades estáticas
  private static registerSchema = z
    .object({
      name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
      email: z.string().email("Formato de email inválido."),
      password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
      role: z.nativeEnum(UserRole, { message: "Papel de usuário inválido." }),
      phone: z.string().optional(),
      address: z.string().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    })
    .strict("Campos adicionais não são permitidos no registro.");

  private static loginSchema = z
    .object({
      email: z.string().email("Formato de email inválido."),
      password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
    })
    .strict("Campos adicionais não são permitidos no login.");

  // Mude para arrow function (como já fizemos)
  register = async (req: Request, res: Response) => {
    try {
      // Acesse o schema usando AuthController.registerSchema
      const validatedData = AuthController.registerSchema.parse(req.body);
      const {
        name,
        email,
        password,
        role,
        phone,
        address,
        latitude,
        longitude,
      } = validatedData;

      const { user, token } = await AuthService.register(
        name,
        email,
        password,
        role,
        phone,
        address,
        latitude,
        longitude
      );
      return res.status(201).json({ user, token });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Erro de validação.", errors: error.errors });
      }
      return res.status(400).json({ message: error.message });
    }
  };

  // Mude para arrow function (como já fizemos)
  login = async (req: Request, res: Response) => {
    try {
      // Acesse o schema usando AuthController.loginSchema
      const validatedData = AuthController.loginSchema.parse(req.body);
      const { email, password } = validatedData;

      const { user, token } = await AuthService.login(email, password);
      return res.status(200).json({ user, token });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Erro de validação.", errors: error.errors });
      }
      return res.status(401).json({ message: error.message });
    }
  };
}

export default new AuthController(); // Continua exportando uma instância
