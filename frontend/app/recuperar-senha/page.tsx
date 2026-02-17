'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordStrengthIndicator } from '@/components/password-strength-indicator';
import { authAPI } from '@/lib/api';
import { validatePasswordStrength } from '@/lib/passwordValidator';
import { AlertCircle, CheckCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function RecuperarSenhaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Step 1: Request Password Reset
  const [phone, setPhone] = useState('');
  const [phoneSubmitted, setPhoneSubmitted] = useState(false);

  // Step 2: Reset Password
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState(() => validatePasswordStrength(''));

  // Se tem token na URL, vamos direto para o passo 2
  useEffect(() => {
    if (token) {
      setStep('reset');
    }
  }, [token]);

  // Step 1: Solicitar recuperação de senha
  const handleRequestPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (!phone) {
      setErrorMessage('Telefone é obrigatório');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await authAPI.requestPasswordReset(phone);

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      setSuccessMessage(
        'Se este telefone estiver registrado, você receberá um link de recuperação'
      );
      setPhoneSubmitted(true);
      setPhone('');

      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (error) {
      setErrorMessage('Erro ao solicitar recuperação de senha');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Resetar senha
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    // Validações
    if (!newPassword || !confirmPassword) {
      setErrorMessage('Todos os campos são obrigatórios');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('As senhas não correspondem');
      setLoading(false);
      return;
    }

    if (!passwordValidation.isValid) {
      setErrorMessage(
        `Senha fraca. ${passwordValidation.errors.join('; ')}`
      );
      setLoading(false);
      return;
    }

    if (!token) {
      setErrorMessage('Token inválido');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await authAPI.resetPassword(token, newPassword);

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      setSuccessMessage('Senha alterada com sucesso! Redirecionando...');
      setTimeout(() => {
        router.push('/entrar/cliente');
      }, 2000);
    } catch (error) {
      setErrorMessage('Erro ao alterar senha');
    } finally {
      setLoading(false);
    }
  };

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    setPasswordValidation(validatePasswordStrength(value));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2 mb-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
          <CardTitle className="text-2xl">Recuperar Senha</CardTitle>
          <CardDescription>
            {step === 'request'
              ? 'Digite seu telefone para recuperar sua senha'
              : 'Defina uma nova senha para sua conta'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Mensagens de erro e sucesso */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm">{errorMessage}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-green-800 text-sm">{successMessage}</p>
            </div>
          )}

          {step === 'request' && (
            <form onSubmit={handleRequestPasswordReset} className="space-y-4">
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  required
                  disabled={phoneSubmitted}
                />
              </div>

              {phoneSubmitted && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Se este telefone estiver registrado em nossa plataforma, você receberá um link de recuperação via email.
                  </p>
                </div>
              )}

              {!phoneSubmitted ? (
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Enviando...' : 'Solicitar Recuperação'}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => {
                    setPhoneSubmitted(false);
                    setPhone('');
                    setSuccessMessage('');
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Tentar Outro Telefone
                </Button>
              )}

              <div className="text-center">
                <Link href="/entrar/cliente" className="text-sm text-blue-600 hover:text-blue-800">
                  Voltar para Login
                </Link>
              </div>
            </form>
          )}

          {step === 'reset' && token && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <Label htmlFor="new-password">Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => handleNewPasswordChange(e.target.value)}
                    placeholder="Digite sua nova senha"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {newPassword && <PasswordStrengthIndicator result={passwordValidation} />}
              </div>

              <div>
                <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme sua nova senha"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || !passwordValidation.isValid}
                className="w-full"
              >
                {loading ? 'Alterando Senha...' : 'Alterar Senha'}
              </Button>

              <div className="text-center">
                <Link href="/entrar/cliente" className="text-sm text-blue-600 hover:text-blue-800">
                  Voltar para Login
                </Link>
              </div>
            </form>
          )}

          {step === 'reset' && !token && (
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Link de recuperação inválido ou expirado.
              </p>
              <Button
                onClick={() => {
                  setStep('request');
                  setErrorMessage('');
                }}
                className="w-full"
              >
                Solicitar Novo Link
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function RecuperarSenhaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Carregando...</div>}>
      <RecuperarSenhaContent />
    </Suspense>
  );
}
