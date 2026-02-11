import { prisma } from '../src/utils/prisma';

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  try {
    // Limpar dados existentes
    console.log('🗑️  Limpando dados anteriores...');
    await prisma.cancellation.deleteMany();
    await prisma.appointment.deleteMany();
    await prisma.review.deleteMany();
    await prisma.favorite.deleteMany();
    await prisma.availability.deleteMany();
    await prisma.service.deleteMany();
    await prisma.barbershop.deleteMany();
    await prisma.user.deleteMany();

    // Criar usuários
    console.log('👤 Criando usuários...');
    const user = await prisma.user.create({
      data: {
        id: 'a9d6753e-893d-4472-bbbc-ad34cfa468eb',
        name: 'Adryan',
        phone: '17996231865',
        password: '$2a$10$ogcg.6N1RVh4S/sCuRScveO/mkdlAr4HzvrusV3DXmoURaWswQuGS',
        role: 'client'
      }
    });
    console.log('✅ Usuário criado:', user.name);

    // Criar barbearias
    console.log('💈 Criando barbearias...');
    const barbershop1 = await prisma.barbershop.create({
      data: {
        id: 'barber-001',
        name: 'BarberPro Premium',
        phone: '1133334444',
        address: 'Av. Paulista, 1000 - São Paulo, SP',
        latitude: '-23.5505',
        longitude: '-46.6333',
        rating: 4.8
      }
    });

    const barbershop2 = await prisma.barbershop.create({
      data: {
        id: 'barber-002',
        name: 'Barba & Tesoura',
        phone: '1144445555',
        address: 'Rua Augusta, 500 - São Paulo, SP',
        latitude: '-23.5555',
        longitude: '-46.6555',
        rating: 4.7
      }
    });
    console.log('✅ Barbearias criadas');

    // Criar serviços
    console.log('🔧 Criando serviços...');
    const service1 = await prisma.service.create({
      data: {
        id: 'service-001',
        barbershopId: barbershop1.id,
        name: 'Corte de Cabelo',
        description: 'Corte clássico de cabelo',
        price: 45,
        duration: 30
      }
    });

    const service2 = await prisma.service.create({
      data: {
        id: 'service-002',
        barbershopId: barbershop1.id,
        name: 'Corte + Barba',
        description: 'Corte de cabelo + aparar a barba',
        price: 65,
        duration: 45
      }
    });

    const service3 = await prisma.service.create({
      data: {
        id: 'service-003',
        barbershopId: barbershop2.id,
        name: 'Corte de Cabelo',
        description: 'Corte clássico de cabelo',
        price: 40,
        duration: 30
      }
    });
    console.log('✅ Serviços criados');

    // Criar agendamento
    console.log('📅 Criando agendamentos...');
    const appointment = await prisma.appointment.create({
      data: {
        id: 'f6092ace-949a-4da0-b47a-3962a27fb9c6',
        barbershopId: barbershop1.id,
        clientId: user.id,
        serviceId: service1.id,
        appointmentDate: new Date('2026-02-09T09:30:00'),
        appointmentTime: '09:30',
        status: 'confirmed'
      }
    });
    console.log('✅ Agendamento criado');

    console.log('\n🎉 Seed concluído com sucesso!');
    console.log(`
📊 Resumo:
  - Usuários: 1
  - Barbearias: 2
  - Serviços: 3
  - Agendamentos: 1
    `);
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Erro fatal:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
