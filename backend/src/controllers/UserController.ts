import { Request, Response } from "express";
import UserService from "../services/UserService";
import { z } from "zod";

class UserController {
  private static updateUserSchema = z
    .object({
      name: z.string().min(3).optional(),
      email: z.string().email().optional(),
      password: z.string().min(6).optional(),
      phone: z.string().optional(),
      address: z.string().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    })
    .strict("Campos adicionais não são permitidos na atualização do usuário.");

  getProfile = async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        return res
          .status(401)
          .json({ message: "ID do usuário não encontrado na requisição." });
      }
      const user = await UserService.findUserById(req.userId);
      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  };

  updateProfile = async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        return res
          .status(401)
          .json({ message: "ID do usuário não encontrado na requisição." });
      }
      const validatedData = UserController.updateUserSchema.parse(req.body);
      const updatedUser = await UserService.updateUser(
        req.userId,
        validatedData
      );
      return res.status(200).json(updatedUser);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Erro de validação.", errors: error.errors });
      }
      return res.status(400).json({ message: error.message });
    }
  };

  listUsers = async (req: Request, res: Response) => {
    try {
      const role = req.query.role as
        | "CITIZEN"
        | "COMPANY"
        | "COOPERATIVE"
        | undefined;
      const users = await UserService.listUsers(role);
      return res.status(200).json(users);
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "Erro ao listar usuários.", error: error.message });
    }
  };

  getUserById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await UserService.findUserById(id);
      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  };
}

export default new UserController();
