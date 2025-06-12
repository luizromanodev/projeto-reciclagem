declare namespace Express {
  interface Request {
    userId?: string;
    // Use a sintaxe de importação de tipo inline para referenciar o enum do Prisma
    userRole?: import("@prisma/client").UserRole;
  }
}
