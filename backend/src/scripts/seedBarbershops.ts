import { getDatabase, saveDatabase } from '../utils/database';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Script para adicionar barbearias ao banco de dados
 * Use este script apenas como desenvolvedor para adicionar/atualizar barbearias
 * 
 * Para executar: npx ts-node src/scripts/seedBarbershops.ts
 */

const barbershopsToAdd = [
  {
    id: '1',
    name: 'Barbearia Premium Downtown',
    email: 'premium@barbershop.com',
    phone: '(11) 98765-4321',
    address: 'Rua das Flores, 123',
    city: 'São Paulo',
    state: 'SP',
    cep: '01310-100',
    password_hash: 'admin123', // Demo: será validado no controller
    status: 'active',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Barbearia Zona Sul',
    email: 'zonasul@barbershop.com',
    phone: '(11) 97654-3210',
    address: 'Avenida Paulista, 456',
    city: 'São Paulo',
    state: 'SP',
    cep: '01311-100',
    password_hash: 'admin123', // Demo: será validado no controller
    status: 'active',
    created_at: new Date().toISOString(),
  },
];

const servicesToAdd = [
  {
    id: '1',
    barbershop_id: '1',
    name: 'Corte de Cabelo',
    description: 'Corte de cabelo tradicional',
    price: 50.00,
    duration: 30,
  },
  {
    id: '2',
    barbershop_id: '1',
    name: 'Barba',
    description: 'Aparagem e design de barba',
    price: 40.00,
    duration: 25,
  },
  {
    id: '3',
    barbershop_id: '1',
    name: 'Corte + Barba',
    description: 'Corte de cabelo + Aparagem de barba',
    price: 80.00,
    duration: 50,
  },
  {
    id: '4',
    barbershop_id: '2',
    name: 'Corte de Cabelo',
    description: 'Corte de cabelo',
    price: 45.00,
    duration: 30,
  },
  {
    id: '5',
    barbershop_id: '2',
    name: 'Barba',
    description: 'Aparagem e design de barba',
    price: 35.00,
    duration: 25,
  },
];

async function seedDatabase() {
  try {
    console.log('🔧 Iniciando seed de barbearias...\n');

    const db = await getDatabase();

    // Adicionar barbearias
    console.log('➕ Adicionando barbearias...');
    const existingIds = db.barbershops.map((b: any) => b.id);
    
    barbershopsToAdd.forEach((barbershop) => {
      if (!existingIds.includes(barbershop.id)) {
        db.barbershops.push(barbershop);
        console.log(`  ✓ Adicionada: ${barbershop.name} (ID: ${barbershop.id})`);
      } else {
        console.log(`  ⚠ Já existe: ${barbershop.name} (ID: ${barbershop.id})`);
      }
    });

    // Adicionar serviços
    console.log('\n➕ Adicionando serviços...');
    const existingServiceIds = db.services.map((s: any) => s.id);
    
    servicesToAdd.forEach((service) => {
      if (!existingServiceIds.includes(service.id)) {
        db.services.push(service);
        console.log(`  ✓ Serviço adicionado: ${service.name} (Barbearia ${service.barbershop_id})`);
      } else {
        console.log(`  ⚠ Serviço já existe: ${service.name}`);
      }
    });

    await saveDatabase();

    console.log('\n✅ Seed concluído com sucesso!');
    console.log('\n📋 Status do banco de dados:');
    console.log(`  - Barbearias: ${db.barbershops.length}`);
    console.log(`  - Serviços: ${db.services.length}`);
    console.log(`  - Usuários: ${db.users.length}`);
    console.log(`  - Agendamentos: ${db.appointments.length}`);
    
    console.log('\n🔐 Credenciais de teste (demo):');
    console.log('  ID Barbearia: 1 ou 2');
    console.log('  Senha: admin123');
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
    process.exit(1);
  }
}

seedDatabase();
