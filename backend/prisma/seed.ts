import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  try {
    // Verifica se já existe dados - se existir, não limpa
    const existingUsers = await prisma.user.count();
    
    if (existingUsers > 0) {
      console.log('⚠️  Banco de dados já possui dados. Seed abortada para não perder informações.');
      return;
    }

    // Só limpa dados se for primeiro acesso (banco vazio)
    console.log('🗑️  Preparando banco vazio...');

    // Criar usuários de teste
    console.log('👤 Criando usuários de teste...');
    
    // Cliente
    const client = await prisma.user.create({
      data: {
        name: 'João Cliente',
        phone: '11987654321',
        email: 'cliente@test.com',
        password: '$2a$10$ogcg.6N1RVh4S/sCuRScveO/mkdlAr4HzvrusV3DXmoURaWswQuGS', // senha: 123456
        role: 'client'
      }
    });
    console.log('✅ Cliente criado:', client.name);

    // Barbeiro/Dono de barbearia
    const barbershopOwner = await prisma.user.create({
      data: {
        name: 'Jose Jacomassi',
        phone: '11987654322',
        email: 'barbeiro@test.com',
        password: '$2a$10$ogcg.6N1RVh4S/sCuRScveO/mkdlAr4HzvrusV3DXmoURaWswQuGS', // senha: 123456
        role: 'barbershop_owner'
      }
    });
    console.log('✅ Barbeiro criado:', barbershopOwner.name);

    // Criar barbearias
    console.log('\n✨ Criando barbearias de teste...');
    
    const barbershop1 = await prisma.barbershop.create({
      data: {
        name: 'Corte Fino Barbearia',
        phone: '1133334444',
        address: 'Rua Augusta, 1200 - Consolação, SP',
        ownerId: barbershopOwner.id,
        rating: 4.9
      }
    });
    console.log('✅ Barbearia criada:', barbershop1.name);

    const barbershop2 = await prisma.barbershop.create({
      data: {
        name: 'Vintage Barber Shop',
        phone: '1144445555',
        address: 'Rua Oscar Freire, 300 - Jardins, SP',
        ownerId: barbershopOwner.id,
        rating: 4.8
      }
    });
    console.log('✅ Barbearia criada:', barbershop2.name);

    const barbershop3 = await prisma.barbershop.create({
      data: {
        name: 'Studio Hair Masculino',
        phone: '1155556666',
        address: 'Av. Paulista, 900 - Bela Vista, SP',
        ownerId: barbershopOwner.id,
        rating: 4.7
      }
    });
    console.log('✅ Barbearia criada:', barbershop3.name);

    const barbershop4 = await prisma.barbershop.create({
      data: {
        name: 'Urban Cuts',
        phone: '1166667777',
        address: 'Rua da Consolação, 2500 - Consolação, SP',
        ownerId: barbershopOwner.id,
        rating: 4.9
      }
    });
    console.log('✅ Barbearia criada:', barbershop4.name);

    const barbershop5 = await prisma.barbershop.create({
      data: {
        name: 'Premium Barber Lounge',
        phone: '1177778888',
        address: 'Rua Haddock Lobo, 800 - Cerqueira César, SP',
        ownerId: barbershopOwner.id,
        rating: 5.0
      }
    });
    console.log('✅ Barbearia criada:', barbershop5.name);

    const barbershop6 = await prisma.barbershop.create({
      data: {
        name: 'Barbearia do Zé',
        phone: '1188889999',
        address: 'Rua Teodoro Sampaio, 400 - Pinheiros, SP',
        ownerId: barbershopOwner.id,
        rating: 4.8
      }
    });
    console.log('✅ Barbearia criada:', barbershop6.name);

    // Criar serviços para a primeira barbearia
    console.log('\n🔧 Criando serviços...');
    
    await prisma.service.createMany({
      data: [
        {
          barbershopId: barbershop1.id,
          name: 'Corte de Cabelo',
          description: 'Corte clássico',
          price: 50,
          duration: 30
        },
        {
          barbershopId: barbershop1.id,
          name: 'Barba',
          description: 'Refilagem de barba',
          price: 30,
          duration: 20
        },
        {
          barbershopId: barbershop1.id,
          name: 'Corte + Barba',
          description: 'Corte e barba juntos',
          price: 70,
          duration: 50
        }
      ]
    });
    console.log('✅ Serviços criados para Corte Fino Barbearia');

    console.log('\n✅ Seed concluído com sucesso!');
    console.log('\n📋 Usuários de teste criados:');
    console.log(`  Cliente: ${client.phone} / ${client.email}`);
    console.log(`  Barbeiro: ${barbershopOwner.phone} / ${barbershopOwner.email}`);
    console.log(`  Senha de teste: 123456`);
    console.log('\n🏪 Barbearias de teste criadas:');
    console.log(`  1. ${barbershop1.name}`);
    console.log(`  2. ${barbershop2.name}`);
    console.log(`  3. ${barbershop3.name}`);
    console.log(`  4. ${barbershop4.name}`);
    console.log(`  5. ${barbershop5.name}`);
    console.log(`  6. ${barbershop6.name}`);
    
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
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
