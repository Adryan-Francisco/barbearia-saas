/**
 * Validador de força de senha
 * Critérios simplificados:
 * - Mínimo 6 caracteres
 * - Deve conter letras e/ou números
 */

export interface PasswordStrengthResult {
  isValid: boolean;
  strength: 'weak' | 'fair' | 'good' | 'strong';
  errors: string[];
  requirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
}

export function validatePasswordStrength(password: string): PasswordStrengthResult {
  const errors: string[] = [];
  const requirements = {
    minLength: password.length >= 6,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  // Validar requisitos simplificados
  if (!requirements.minLength) {
    errors.push('Mínimo 6 caracteres');
  }
  
  const hasBasicVariety = requirements.hasUppercase || requirements.hasLowercase || requirements.hasNumber;
  if (!hasBasicVariety) {
    errors.push('Use letras ou números');
  }

  // Determinar força da senha
  const metRequirements = Object.values(requirements).filter(Boolean).length;
  let strength: 'weak' | 'fair' | 'good' | 'strong' = 'weak';

  if (metRequirements >= 4) {
    strength = 'strong';
  } else if (metRequirements >= 3) {
    strength = 'good';
  } else if (metRequirements >= 2) {
    strength = 'fair';
  }

  return {
    isValid: errors.length === 0,
    strength,
    errors,
    requirements,
  };
}

export function getPasswordStrengthMessage(strength: string): string {
  const messages: Record<string, string> = {
    weak: 'Senha muito fraca',
    fair: 'Senha fraca',
    good: 'Senha boa',
    strong: 'Senha forte',
  };
  return messages[strength] || 'Força desconhecida';
}
