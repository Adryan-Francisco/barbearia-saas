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
        name: 'Carlos Barbeiro',
        phone: '11987654322',
        email: 'barbeiro@test.com',
        password: '$2a$10$ogcg.6N1RVh4S/sCuRScveO/mkdlAr4HzvrusV3DXmoURaWswQuGS', // senha: 123456
        role: 'barbershop_owner'
      }
    });
    console.log('✅ Barbeiro criado:', barbershopOwner.name);

    console.log('\n✅ Seed concluído com sucesso!');
    console.log('\n📋 Usuários de teste criados:');
    console.log(`  Cliente: ${client.phone} / ${client.email}`);
    console.log(`  Barbeiro: ${barbershopOwner.phone} / ${barbershopOwner.email}`);
    console.log(`  Senha de teste: 123456`);
    console.log('\n💡 O barbeiro pode agora cadastrar sua barbearia através da API!');
    
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
