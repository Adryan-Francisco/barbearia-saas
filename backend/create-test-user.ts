import { prisma } from './src/utils/prisma';
import { hashPassword } from './src/utils/hash';

async function createTestUser() {
  try {
    console.log('📝 Criando usuário de teste...');
    
    // Limpar usuário anterior se existir
    await prisma.user.deleteMany({
      where: { email: 'adryan@test.com' }
    });
    
    const hashedPassword = await hashPassword('123456');
    
    const user = await prisma.user.create({
      data: {
        name: 'Adryan Francisco',
        phone: '17996231865',
        email: 'adryan@test.com',
        password: hashedPassword,
        role: 'client'
      }
    });
    
    console.log('✅ Usuário criado com sucesso!');
    console.log('📧 Email:', user.email);
    console.log('📱 Telefone:', user.phone);
    console.log('🔑 Senha: 123456');
    
  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
