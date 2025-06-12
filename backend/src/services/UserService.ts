import prisma from "../utils/prisma";
import { hashPassword } from "../utils/auth";

class UserService {
  async findUserById(id: string) {
    const user = await prisma.user.findUnique({
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

  async updateUser(
    id: string,
    data: {
      name?: string;
      email?: string;
      password?: string;
      phone?: string;
      address?: string;
      latitude?: number;
      longitude?: number;
    }
  ) {
    if (data.password) {
      data.password = await hashPassword(data.password); // Faz hash da nova senha se fornecida
    }

    const updatedUser = await prisma.user.update({
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

  async listUsers(role?: "CITIZEN" | "COMPANY" | "COOPERATIVE") {
    const users = await prisma.user.findMany({
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

export default new UserService();
