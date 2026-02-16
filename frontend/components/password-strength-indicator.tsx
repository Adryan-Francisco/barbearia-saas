'use client'

import { PasswordStrengthResult, getPasswordStrengthColor, getPasswordStrengthMessage } from '@/lib/passwordValidator'
import { CheckCircle2, Circle } from 'lucide-react'

interface PasswordStrengthIndicatorProps {
  result: PasswordStrengthResult
}

export function PasswordStrengthIndicator({ result }: PasswordStrengthIndicatorProps) {
  return (
    <div className="space-y-3">
      {/* Barra de força */}
      <div className="flex gap-1">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className={`h-1.5 flex-1 rounded-full transition-all ${
              index < ['weak', 'fair', 'good', 'strong'].indexOf(result.strength) + 1
                ? getPasswordStrengthColor(result.strength)
                : 'bg-border'
            }`}
          />
        ))}
      </div>

      {/* Mensagem de força */}
      <div className="flex items-center gap-2">
        <span className={`text-sm font-medium ${
          result.strength === 'strong'
            ? 'text-emerald-600'
            : result.strength === 'good'
            ? 'text-blue-600'
            : result.strength === 'fair'
            ? 'text-yellow-600'
            : 'text-destructive'
        }`}>
          {getPasswordStrengthMessage(result.strength)}
        </span>
      </div>

      {/* Requisitos */}
      <div className="space-y-2 bg-muted/30 rounded-lg p-3">
        <p className="text-xs font-semibold text-muted-foreground">Requisitos de Segurança:</p>
        <div className="space-y-1.5">
          {[
            { key: 'minLength' as const, label: 'Mínimo 8 caracteres' },
            { key: 'hasUppercase' as const, label: 'Pelo menos 1 letra maiúscula (A-Z)' },
            { key: 'hasLowercase' as const, label: 'Pelo menos 1 letra minúscula (a-z)' },
            { key: 'hasNumber' as const, label: 'Pelo menos 1 número (0-9)' },
            { key: 'hasSpecialChar' as const, label: 'Pelo menos 1 caractere especial (!@#$%^&*)' },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center gap-2">
              {result.requirements[key] ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              )}
              <span className={`text-xs ${
                result.requirements[key]
                  ? 'text-muted-foreground line-through'
                  : 'text-muted-foreground'
              }`}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mensagens de erro */}
      {result.errors.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-2.5">
          <ul className="text-xs text-destructive space-y-1">
            {result.errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
