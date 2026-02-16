/**
 * Validador de força de senha
 * Critérios:
 * - Mínimo 8 caracteres
 * - Pelo menos 1 letra maiúscula
 * - Pelo menos 1 letra minúscula
 * - Pelo menos 1 número
 * - Pelo menos 1 caractere especial
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
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  // Validar requisitos
  if (!requirements.minLength) {
    errors.push('Mínimo 8 caracteres');
  }
  if (!requirements.hasUppercase) {
    errors.push('Pelo menos 1 letra maiúscula (A-Z)');
  }
  if (!requirements.hasLowercase) {
    errors.push('Pelo menos 1 letra minúscula (a-z)');
  }
  if (!requirements.hasNumber) {
    errors.push('Pelo menos 1 número (0-9)');
  }
  if (!requirements.hasSpecialChar) {
    errors.push('Pelo menos 1 caractere especial (!@#$%^&* etc)');
  }

  // Determinar força da senha
  const metRequirements = Object.values(requirements).filter(Boolean).length;
  let strength: 'weak' | 'fair' | 'good' | 'strong' = 'weak';

  if (metRequirements === 5) {
    strength = 'strong';
  } else if (metRequirements === 4) {
    strength = 'good';
  } else if (metRequirements === 3) {
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
