declare namespace Express {
  interface Request {
    userId?: string;
    userRole?: import("@prisma/client").UserRole;
  }
}
