'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Loader2, Plus } from 'lucide-react';

interface Barbershop {
  id: string;
  name: string;
  phone: string;
  address: string;
  latitude?: string;
  longitude?: string;
  rating?: number;
  services: any[];
  appointments: any[];
  reviews: any[];
  createdAt: string;
}

export default function BarbershopPage() {
  const router = useRouter();
  const [barbershop, setBarbershop] = useState<Barbershop | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    latitude: '',
    longitude: '',
  });

  useEffect(() => {
    fetchBarbershop();
  }, []);

  const fetchBarbershop = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/barbershops/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBarbershop(data.barbershop);
        setFormData({
          name: data.barbershop.name,
          phone: data.barbershop.phone,
          address: data.barbershop.address,
          latitude: data.barbershop.latitude || '',
          longitude: data.barbershop.longitude || '',
        });
      } else if (response.status === 404) {
        // Sem barbearia
        setShowCreateForm(true);
      }
    } catch (err) {
      setError('Erro ao carregar barbearia');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const method = barbershop ? 'PUT' : 'POST';
      const url = barbershop
        ? `http://localhost:3001/api/barbershops/${barbershop.id}`
        : 'http://localhost:3001/api/barbershops';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setBarbershop(data.barbershop);
        setSuccess(
          barbershop ? 'Barbearia atualizada com sucesso!' : 'Barbearia criada com sucesso!'
        );
        setEditing(false);
        setShowCreateForm(false);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Erro ao salvar barbearia');
      }
    } catch (err) {
      setError('Erro ao conectar ao servidor');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (showCreateForm || !barbershop) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Cadastrar Barbearia</CardTitle>
            <CardDescription>
              Complete as informações de sua barbearia para começar a receber agendamentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome da Barbearia *</label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: Barbearia Premium"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Telefone *</label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Endereço *</label>
                <Input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Rua das Flores, 123 - São Paulo, SP"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Latitude</label>
                  <Input
                    type="text"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    placeholder="-23.5505"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Longitude</label>
                  <Input
                    type="text"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    placeholder="-46.6333"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Cadastrar Barbearia
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Informações da Barbearia</CardTitle>
            <CardDescription>Dados da sua barbearia</CardDescription>
          </div>
          <div className="flex gap-2">
            {!editing && (
              <Button onClick={() => setEditing(true)} variant="outline">
                Editar
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome *</label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Telefone *</label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Endereço *</label>
                <Input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Latitude</label>
                  <Input
                    type="text"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Longitude</label>
                  <Input
                    type="text"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar Alterações'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditing(false);
                    setFormData({
                      name: barbershop.name,
                      phone: barbershop.phone,
                      address: barbershop.address,
                      latitude: barbershop.latitude || '',
                      longitude: barbershop.longitude || '',
                    });
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Nome</label>
                <p className="text-lg">{barbershop.name}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Telefone</label>
                <p className="text-lg">{barbershop.phone}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Endereço</label>
                <p className="text-lg">{barbershop.address}</p>
              </div>

              {(barbershop.latitude || barbershop.longitude) && (
                <div className="grid grid-cols-2 gap-4">
                  {barbershop.latitude && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Latitude</label>
                      <p className="text-lg">{barbershop.latitude}</p>
                    </div>
                  )}
                  {barbershop.longitude && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Longitude</label>
                      <p className="text-lg">{barbershop.longitude}</p>
                    </div>
                  )}
                </div>
              )}

              {barbershop.rating && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Avaliação</label>
                  <p className="text-lg">⭐ {barbershop.rating.toFixed(1)}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Serviços</CardTitle>
          <CardDescription>Gerencie os serviços oferecidos</CardDescription>
        </CardHeader>
        <CardContent>
          {barbershop.services.length > 0 ? (
            <div className="space-y-2">
              {barbershop.services.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{service.name}</p>
                    {service.description && (
                      <p className="text-sm text-gray-500">{service.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">R$ {service.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">{service.duration} min</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Nenhum serviço cadastrado</p>
          )}
          <Link href={`/dashboard/servicos`}>
            <Button className="mt-4" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Gerenciar Serviços
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estatísticas</CardTitle>
          <CardDescription>Resumo da atividade</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50 rounded">
              <p className="text-sm text-gray-500">Total de Agendamentos</p>
              <p className="text-2xl font-bold">{barbershop.appointments.length}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded">
              <p className="text-sm text-gray-500">Avaliações</p>
              <p className="text-2xl font-bold">{barbershop.reviews.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
