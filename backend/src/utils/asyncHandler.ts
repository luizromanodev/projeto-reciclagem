import { Request, Response, NextFunction } from "express";

// Define o tipo para uma função assíncrona do Express (controller method)
type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

// Wrapper para lidar com erros em funções assíncronas do Express
const asyncHandler =
  (fn: AsyncFunction) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
