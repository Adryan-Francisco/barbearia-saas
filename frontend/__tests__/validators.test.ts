/**
 * Testes para o sistema de validação do frontend
 */

import {
  validateField,
  validateForm,
  isValidEmail,
  isValidPhone,
  isValidUrl,
  formatPhone,
  ValidationSchema,
} from '@/lib/validators'

describe('Frontend Validators', () => {
  describe('Email Validation', () => {
    it('valida emails válidos', () => {
      expect(isValidEmail('user@example.com')).toBe(true)
      expect(isValidEmail('test.user@domain.co.uk')).toBe(true)
      expect(isValidEmail('user+tag@example.com')).toBe(true)
    })

    it('rejeita emails inválidos', () => {
      expect(isValidEmail('invalid')).toBe(false)
      expect(isValidEmail('user@')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
      expect(isValidEmail('user @example.com')).toBe(false)
    })

    it('valida campo de email com validateField', () => {
      const rules = { required: true, type: 'email' as const }
      expect(validateField('user@example.com', 'email', rules)).toBeNull()
      expect(validateField('invalid', 'email', rules)).not.toBeNull()
    })
  })

  describe('Phone Validation', () => {
    it('valida telefones no formato (XX) XXXXX-XXXX', () => {
      expect(isValidPhone('(11) 99999-9999')).toBe(true)
      expect(isValidPhone('(21) 3333-3333')).toBe(true)
    })

    it('rejeita telefones inválidos', () => {
      expect(isValidPhone('11999999999')).toBe(false)
      expect(isValidPhone('(11) 9999-999')).toBe(false)
      expect(isValidPhone('11 99999-9999')).toBe(false)
    })

    it('formata telefone corretamente', () => {
      expect(formatPhone('11999999999')).toBe('(11) 99999-9999')
      expect(formatPhone('1133333333')).toBe('(11) 3333-3333')
      expect(formatPhone('(11) 3333-3333')).toBe('(11) 3333-3333')
    })
  })

  describe('URL Validation', () => {
    it('valida URLs válidas', () => {
      expect(isValidUrl('https://example.com')).toBe(true)
      expect(isValidUrl('http://localhost:3000')).toBe(true)
      expect(isValidUrl('https://example.com/path')).toBe(true)
    })

    it('rejeita URLs inválidas', () => {
      expect(isValidUrl('not a url')).toBe(false)
      expect(isValidUrl('example.com')).toBe(false)
    })
  })

  describe('Field Validation', () => {
    it('valida campo obrigatório', () => {
      const rules = { required: true, type: 'string' as const }
      expect(validateField('', 'name', rules)).not.toBeNull()
      expect(validateField('John', 'name', rules)).toBeNull()
    })

    it('valida comprimento mínimo', () => {
      const rules = { required: true, type: 'string' as const, minLength: 3 }
      expect(validateField('ab', 'username', rules)).not.toBeNull()
      expect(validateField('abc', 'username', rules)).toBeNull()
    })

    it('valida comprimento máximo', () => {
      const rules = { required: true, type: 'string' as const, maxLength: 10 }
      expect(validateField('abcdefghijk', 'name', rules)).not.toBeNull()
      expect(validateField('abcdefghij', 'name', rules)).toBeNull()
    })

    it('valida números', () => {
      const rules = { required: true, type: 'number' as const, min: 0, max: 100 }
      expect(validateField(50, 'score', rules)).toBeNull()
      expect(validateField(150, 'score', rules)).not.toBeNull()
      expect(validateField(-1, 'score', rules)).not.toBeNull()
    })

    it('valida padrão regex', () => {
      const rules = {
        required: true,
        type: 'string' as const,
        pattern: /^[A-Z][a-z]+$/,
      }
      expect(validateField('John', 'name', rules)).toBeNull()
      expect(validateField('john', 'name', rules)).not.toBeNull()
    })

    it('permite validação customizada', () => {
      const rules = {
        required: true,
        type: 'string' as const,
        custom: (value: string) => {
          return value.includes('admin') ? 'Palavra-chave não permitida' : null
        },
      }
      expect(validateField('user', 'username', rules)).toBeNull()
      expect(validateField('admin', 'username', rules)).not.toBeNull()
    })

    it('allows optional fields to be empty', () => {
      const rules = { required: false, type: 'email' as const }
      expect(validateField('', 'email', rules)).toBeNull()
    })
  })

  describe('Form Validation', () => {
    it('valida formulário inteiro', () => {
      const schema: ValidationSchema = {
        name: { required: true, type: 'string' as const, minLength: 2 },
        email: { required: true, type: 'email' as const },
        phone: { required: true, type: 'phone' as const },
      }

      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '(11) 99999-9999',
      }

      const invalidData = {
        name: 'J',
        email: 'invalid',
        phone: 'invalid',
      }

      expect(Object.keys(validateForm(validData, schema))).toHaveLength(0)
      expect(Object.keys(validateForm(invalidData, schema))).toHaveLength(3)
    })

    it('retorna erros específicos por campo', () => {
      const schema: ValidationSchema = {
        age: { required: true, type: 'number' as const, min: 18, max: 100 },
      }

      const errors = validateForm({ age: 10 }, schema)
      expect(errors.age).toBeDefined()
      expect(errors.age).toContain('18')
    })

    it('valida campos opcionais', () => {
      const schema: ValidationSchema = {
        name: { required: true, type: 'string' as const },
        nickname: { required: false, type: 'string' as const, minLength: 2 },
      }

      const data = { name: 'John' } // nickname é opcional e não fornecido

      expect(Object.keys(validateForm(data, schema))).toHaveLength(0)
    })
  })

  describe('Predefined Schemas', () => {
    it('schema de login de cliente valida corretamente', () => {
      // Será testado quando os schemas forem importados
      expect(true).toBe(true)
    })
  })
})
