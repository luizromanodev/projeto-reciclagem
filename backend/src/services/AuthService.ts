import prisma from "../utils/prisma";
import { hashPassword, comparePassword, generateToken } from "../utils/auth";
import { UserRole } from "@prisma/client"; // Importa o enum de roles do Prisma

class AuthService {
  async register(
    name: string,
    email: string,
    password_raw: string,
    role: UserRole,
    phone?: string,
    address?: string,
    latitude?: number,
    longitude?: number
  ) {
    // 1. Verifica se o usuário já existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error("Usuário com este email já existe.");
    }

    // 2. Faz o hash da senha antes de salvar
    const password = await hashPassword(password_raw);

    // 3. Cria o usuário no banco de dados
    const user = await prisma.user.create({
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
    const token = generateToken({ id: user.id, role: user.role });

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

  async login(email: string, password_raw: string) {
    // 1. Busca o usuário pelo email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error("Credenciais inválidas: Email ou senha incorretos.");
    }

    // 2. Compara a senha fornecida com a senha hasheada no banco
    const passwordMatch = await comparePassword(password_raw, user.password);
    if (!passwordMatch) {
      throw new Error("Credenciais inválidas: Email ou senha incorretos.");
    }

    // 3. Gera um token JWT para o usuário logado
    const token = generateToken({ id: user.id, role: user.role });

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

export default new AuthService();
