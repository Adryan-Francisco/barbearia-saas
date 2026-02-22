/**
 * Sistema de validações unificado para o Frontend
 * Segue os mesmos padrões de validação do backend
 */

export interface ValidationSchema {
  [fieldName: string]: ValidationRules;
}

export interface ValidationRules {
  required?: boolean;
  type?: 'string' | 'email' | 'phone' | 'number' | 'date' | 'url';
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
  errorMessage?: string;
}

export interface ValidationErrors {
  [fieldName: string]: string;
}

/**
 * Valida um único campo
 */
export function validateField(
  value: any,
  fieldName: string,
  rules: ValidationRules
): string | null {
  // Validar obrigatoriedade
  if (rules.required && (value === undefined || value === null || value === '')) {
    return rules.errorMessage || `${fieldName} é obrigatório`;
  }

  // Se não é obrigatório e está vazio, passar
  if (!rules.required && (value === undefined || value === null || value === '')) {
    return null;
  }

  // Validar tipo
  switch (rules.type) {
    case 'email':
      if (!isValidEmail(value)) {
        return rules.errorMessage || `${fieldName} deve ser um email válido`;
      }
      break;

    case 'phone':
      if (!isValidPhone(value)) {
        return rules.errorMessage || `${fieldName} deve estar no formato (XX) XXXXX-XXXX`;
      }
      break;

    case 'number':
      if (isNaN(Number(value))) {
        return rules.errorMessage || `${fieldName} deve ser um número`;
      }
      break;

    case 'date':
      if (isNaN(Date.parse(value))) {
        return rules.errorMessage || `${fieldName} deve ser uma data válida`;
      }
      break;

    case 'url':
      if (!isValidUrl(value)) {
        return rules.errorMessage || `${fieldName} deve ser uma URL válida`;
      }
      break;

    case 'string':
      if (typeof value !== 'string') {
        return rules.errorMessage || `${fieldName} deve ser texto`;
      }
      break;
  }

  // Validar comprimento
  if (typeof value === 'string') {
    if (rules.minLength && value.length < rules.minLength) {
      return (
        rules.errorMessage ||
        `${fieldName} deve ter no mínimo ${rules.minLength} caracteres`
      );
    }
    if (rules.maxLength && value.length > rules.maxLength) {
      return (
        rules.errorMessage ||
        `${fieldName} deve ter no máximo ${rules.maxLength} caracteres`
      );
    }
  }

  // Validar números
  if (typeof value === 'number' || !isNaN(Number(value))) {
    const num = Number(value);
    if (rules.min !== undefined && num < rules.min) {
      return rules.errorMessage || `${fieldName} deve ser no mínimo ${rules.min}`;
    }
    if (rules.max !== undefined && num > rules.max) {
      return rules.errorMessage || `${fieldName} deve ser no máximo ${rules.max}`;
    }
  }

  // Validar padrão regex
  if (rules.pattern && !rules.pattern.test(String(value))) {
    return rules.errorMessage || `${fieldName} tem um formato inválido`;
  }

  // Validação customizada
  if (rules.custom) {
    const customError = rules.custom(value);
    if (customError) {
      return customError;
    }
  }

  return null;
}

/**
 * Valida múltiplos campos contra um schema
 */
export function validateForm(
  data: Record<string, any>,
  schema: ValidationSchema
): ValidationErrors {
  const errors: ValidationErrors = {};

  for (const [fieldName, rules] of Object.entries(schema)) {
    const error = validateField(data[fieldName], fieldName, rules);
    if (error) {
      errors[fieldName] = error;
    }
  }

  return errors;
}

/**
 * Funções de validação utilitárias
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function isValidPhone(phone: string): boolean {
  // Formato: (XX) XXXXX-XXXX
  const regex = /^\([0-9]{2}\) [0-9]{4,5}-[0-9]{4}$/;
  return regex.test(phone);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function formatPhone(phone: string): string {
  // Remove caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone;
}

// Schemas predefinidos para formulários comuns
export const SCHEMAS = {
  clientLogin: {
    phone: {
      required: true,
      type: 'phone' as const,
      errorMessage: 'Telefone inválido',
    },
    password: {
      required: true,
      type: 'string' as const,
      minLength: 6,
      errorMessage: 'Senha deve ter no mínimo 6 caracteres',
    },
  },

  clientSignup: {
    name: {
      required: true,
      type: 'string' as const,
      minLength: 2,
      maxLength: 100,
      errorMessage: 'Nome deve ter entre 2 e 100 caracteres',
    },
    phone: {
      required: true,
      type: 'phone' as const,
      errorMessage: 'Telefone inválido',
    },
    password: {
      required: true,
      type: 'string' as const,
      minLength: 8,
      errorMessage: 'Senha deve ter no mínimo 8 caracteres',
    },
  },

  barbershopSignup: {
    barbershopName: {
      required: true,
      type: 'string' as const,
      minLength: 2,
      maxLength: 100,
      errorMessage: 'Nome da barbearia deve ter entre 2 e 100 caracteres',
    },
    email: {
      required: true,
      type: 'email' as const,
      errorMessage: 'Email inválido',
    },
    phone: {
      required: true,
      type: 'phone' as const,
      errorMessage: 'Telefone inválido',
    },
    password: {
      required: true,
      type: 'string' as const,
      minLength: 8,
      errorMessage: 'Senha deve ter no mínimo 8 caracteres',
    },
  },

  scheduling: {
    barbershopId: {
      required: true,
      type: 'string' as const,
      errorMessage: 'Barbearia é obrigatória',
    },
    serviceId: {
      required: true,
      type: 'string' as const,
      errorMessage: 'Serviço é obrigatório',
    },
    barberId: {
      required: true,
      type: 'string' as const,
      errorMessage: 'Barbeiro é obrigatório',
    },
    date: {
      required: true,
      type: 'date' as const,
      errorMessage: 'Data inválida',
    },
    time: {
      required: true,
      type: 'string' as const,
      pattern: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      errorMessage: 'Hora inválida',
    },
  },
};
