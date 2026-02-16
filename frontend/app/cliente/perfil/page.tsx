'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordStrengthIndicator } from '@/components/password-strength-indicator';
import { authAPI } from '@/lib/api';
import { validatePasswordStrength } from '@/lib/passwordValidator';
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

export default function PerfilPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Formulário de edição de perfil
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [editingProfile, setEditingProfile] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Formulário de mudança de senha
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState(() => validatePasswordStrength(''));

  // Carregar dados do usuário
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data, error } = await authAPI.getProfile();

        if (error) {
          setErrorMessage(error.message);
          setTimeout(() => router.push('/entrar/cliente'), 2000);
          return;
        }

        if (data) {
          setName((data as any).name || '');
          setPhone((data as any).phone || '');
        }
      } catch (error) {
        setErrorMessage('Erro ao carregar perfil');
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [router]);

  // Atualizar perfil
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const { data, error } = await authAPI.updateProfile(name, phone);

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setSuccessMessage('Perfil atualizado com sucesso!');
      setEditingProfile(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  // Mudar senha
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangingPassword(true);
    setErrorMessage('');
    setSuccessMessage('');

    // Validações
    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage('Todos os campos são obrigatórios');
      setChangingPassword(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('As senhas não correspondem');
      setChangingPassword(false);
      return;
    }

    if (!passwordValidation.isValid) {
      setErrorMessage(`Senha fraca. ${passwordValidation.errors.join('; ')}`);
      setChangingPassword(false);
      return;
    }

    try {
      const { data, error } = await authAPI.changePassword(currentPassword, newPassword);

      if (error) {
        setErrorMessage(error.message);
        setChangingPassword(false);
        return;
      }

      setSuccessMessage('Senha alterada com sucesso!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Erro ao alterar senha');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    setPasswordValidation(validatePasswordStrength(value));
  };

  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Meu Perfil</h1>

      {/* Mensagens de erro e sucesso */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800">{errorMessage}</p>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-green-800">{successMessage}</p>
        </div>
      )}

      {/* Seção de edição de perfil */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
          <CardDescription>
            {editingProfile
              ? 'Edite suas informações de perfil'
              : 'Visualize suas informações de perfil'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!editingProfile ? (
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-gray-600">Nome</Label>
                <p className="text-lg font-medium">{name}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Telefone</Label>
                <p className="text-lg font-medium">{phone}</p>
              </div>
              <Button
                type="button"
                onClick={() => setEditingProfile(true)}
                className="w-full"
              >
                Editar Perfil
              </Button>
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingProfile(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Seção de informações do sistema */}
      <Card className="mb-8 bg-gray-50">
        <CardHeader>
          <CardTitle>Informações do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Versão:</span>
              <span className="text-sm font-medium">v0.1.0</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seção de mudança de senha */}
      <Card>
        <CardHeader>
          <CardTitle>Alterar Senha</CardTitle>
          <CardDescription>Mude sua senha de acesso</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <Label htmlFor="current-password">Senha Atual</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Digite sua senha atual"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

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
              disabled={changingPassword || !passwordValidation.isValid}
              className="w-full"
            >
              {changingPassword ? 'Alterando Senha...' : 'Alterar Senha'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
