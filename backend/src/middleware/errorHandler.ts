import { Request, Response, NextFunction } from 'express';

/**
 * Classe customizada para erros da aplicação
 * Facilita tratamento padronizado de erros
 */
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public errors?: Record<string, string>,
    public context?: Record<string, any>
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Classe para erros de validação
 */
export class ValidationError extends AppError {
  constructor(
    errors: Record<string, string>,
    message: string = 'Validação falhou'
  ) {
    super(message, 400, errors);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Classe para erros de autenticação
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Não autenticado') {
    super(message, 401);
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * Classe para erros de autorização
 */
export class AuthorizationError extends AppError {
  constructor(message: string = 'Acesso negado') {
    super(message, 403);
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

/**
 * Classe para recurso não encontrado
 */
export class NotFoundError extends AppError {
  constructor(resource: string = 'Recurso') {
    super(`${resource} não encontrado`, 404);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Classe para conflito (ex: recurso já existe)
 */
export class ConflictError extends AppError {
  constructor(message: string = 'Recurso já existe') {
    super(message, 409);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

/**
 * Interface para resposta de erro padronizada
 */
export interface ErrorResponse {
  error: string;
  message: string;
  status: number;
  timestamp: string;
  path?: string;
  errors?: Record<string, string>;
  context?: Record<string, any>;
}

/**
 * Middleware para tratamento centralizado de erros
 */
export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const timestamp = new Date().toISOString();
  const path = req.path;

  // Tratamento para erros personalizados da aplicação
  if (err instanceof AppError) {
    const statusCode = err.statusCode || 500;
    const response: ErrorResponse = {
      error: err.message,
      message: err.message,
      status: statusCode,
      timestamp,
      path,
    };

    // Adicionar erros de validação se existirem
    if (err.errors) {
      response.errors = err.errors;
    }

    // Adicionar contexto em desenvolvimento
    if (process.env.NODE_ENV === 'development' && err.context) {
      response.context = err.context;
    }

    console.error(`❌ AppError [${statusCode}]:`, {
      message: err.message,
      errors: err.errors,
      path,
      timestamp,
    });

    return res.status(statusCode).json(response);
  }

  // Tratamento para erros do Prisma
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaErr = err as any;
    let message = 'Erro ao processar requisição';
    let statusCode = 400;

    switch (prismaErr.code) {
      case 'P2002':
        message = 'Este registro já existe';
        statusCode = 409;
        break;
      case 'P2025':
        message = 'Registro não encontrado';
        statusCode = 404;
        break;
      case 'P2003':
        message = 'Referência inválida para outro registro';
        statusCode = 400;
        break;
    }

    console.error(`❌ Prisma Error [${prismaErr.code}]:`, message);
    return res.status(statusCode).json({
      error: message,
      message: message,
      status: statusCode,
      timestamp,
      path,
    });
  }

  // Tratamento para erros JWT
  if (err.name === 'JsonWebTokenError') {
    console.error('❌ JWT Error:', err.message);
    return res.status(401).json({
      error: 'Token inválido',
      message: 'Token inválido',
      status: 401,
      timestamp,
      path,
    });
  }

  if (err.name === 'TokenExpiredError') {
    console.error('❌ Token Expired');
    return res.status(401).json({
      error: 'Token expirado',
      message: 'Token expirado',
      status: 401,
      timestamp,
      path,
    });
  }

  // Tratamento padrão para erros não capturados
  console.error('❌ Erro não tratado:', {
    message: err.message,
    name: err.name,
    stack: err.stack,
    path,
    timestamp,
  });

  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(500).json({
    error: isDevelopment ? err.message : 'Erro interno do servidor',
    message: isDevelopment ? err.message : 'Ocorreu um erro ao processar sua requisição',
    status: 500,
    timestamp,
    path,
    ...(isDevelopment && { stack: err.stack }),
  });
}
