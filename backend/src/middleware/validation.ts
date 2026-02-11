import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export interface ValidationRule {
  field: string;
  type: 'string' | 'number' | 'boolean' | 'email' | 'phone' | 'date' | 'uuid';
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export function validateRequest(rules: ValidationRule[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: { [key: string]: string } = {};

    for (const rule of rules) {
      const value = req.body[rule.field];

      // Validar se é obrigatório
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors[rule.field] = `${rule.field} é obrigatório`;
        continue;
      }

      // Se não é obrigatório e está vazio, pular
      if (!rule.required && (value === undefined || value === null || value === '')) {
        continue;
      }

      // Validar tipo
      switch (rule.type) {
        case 'email':
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            errors[rule.field] = `${rule.field} deve ser um email válido`;
          }
          break;

        case 'phone':
          if (!/^\([0-9]{2}\) [0-9]{4,5}-[0-9]{4}$/.test(value)) {
            errors[rule.field] = `${rule.field} deve estar no formato (XX) XXXXX-XXXX`;
          }
          break;

        case 'date':
          if (isNaN(Date.parse(value))) {
            errors[rule.field] = `${rule.field} deve ser uma data válida`;
          }
          break;

        case 'uuid':
          if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
            errors[rule.field] = `${rule.field} deve ser um UUID válido`;
          }
          break;

        case 'number':
          if (typeof value !== 'number' && isNaN(Number(value))) {
            errors[rule.field] = `${rule.field} deve ser um número`;
          }
          break;

        case 'boolean':
          if (typeof value !== 'boolean') {
            errors[rule.field] = `${rule.field} deve ser verdadeiro ou falso`;
          }
          break;

        case 'string':
          if (typeof value !== 'string') {
            errors[rule.field] = `${rule.field} deve ser texto`;
          }
          break;
      }

      // Validar comprimento mínimo e máximo (para strings e arrays)
      if (typeof value === 'string') {
        if (rule.min && value.length < rule.min) {
          errors[rule.field] = `${rule.field} deve ter no mínimo ${rule.min} caracteres`;
        }
        if (rule.max && value.length > rule.max) {
          errors[rule.field] = `${rule.field} deve ter no máximo ${rule.max} caracteres`;
        }
      }

      // Validar padrão regex
      if (rule.pattern && !rule.pattern.test(value)) {
        errors[rule.field] = `${rule.field} tem um formato inválido`;
      }

      // Validar função customizada
      if (rule.custom) {
        const result = rule.custom(value);
        if (result !== true) {
          errors[rule.field] = typeof result === 'string' ? result : `${rule.field} é inválido`;
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      const error = new AppError('Validação falhou', 400);
      (error as any).errors = errors;
      throw error;
    }

    next();
  };
}

// Funções de validação reutilizáveis
export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePhone = (phone: string): boolean => {
  return /^\([0-9]{2}\) [0-9]{4,5}-[0-9]{4}$/.test(phone);
};

export const validatePassword = (password: string): string | true => {
  if (password.length < 8) {
    return 'Senha deve ter no mínimo 8 caracteres';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Senha deve conter letra maiúscula';
  }
  if (!/[0-9]/.test(password)) {
    return 'Senha deve conter número';
  }
  return true;
};
