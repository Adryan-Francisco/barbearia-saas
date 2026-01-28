import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt';
import { AppError } from './errorHandler';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Cabeçalho de autorização ausente ou inválido', 401);
    }

    const token = authHeader.substring(7);
    const user = verifyToken(token);
    
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Token inválido', 401);
  }
}
