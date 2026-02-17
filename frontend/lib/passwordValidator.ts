/**
 * Hook para validação de força de senha no frontend
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
    minLength: password.length >= 6, // Reduzido de 8 para 6
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  // Validar requisitos menos rigorosos
  if (!requirements.minLength) {
    errors.push('Mínimo 6 caracteres');
  }
  // Apenas um de maiúscula, minúscula ou número é necessário
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

export function getPasswordStrengthColor(strength: string): string {
  const colors: Record<string, string> = {
    weak: 'bg-destructive',
    fair: 'bg-yellow-500',
    good: 'bg-blue-500',
    strong: 'bg-emerald-500',
  };
  return colors[strength] || 'bg-gray-300';
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
