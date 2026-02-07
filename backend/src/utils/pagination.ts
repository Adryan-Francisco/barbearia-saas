import { Request, Response, NextFunction } from 'express';

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Extrai parâmetros de paginação da query
 */
export function getPaginationParams(req: Request): PaginationParams {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
}

/**
 * Formata resposta paginada
 */
export function formatPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResponse<T> {
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

/**
 * Middleware para validar parâmetros de paginação
 */
export function paginationMiddleware(req: Request, res: Response, next: NextFunction) {
  const params = getPaginationParams(req);
  (req as any).pagination = params;
  next();
}
