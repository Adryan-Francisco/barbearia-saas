import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateToken } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';
import { validatePasswordStrength } from '../utils/passwordValidator';
import crypto from 'crypto';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    console.log("📝 Tentativa de registro - dados recebidos:", req.body);
    
    const { name, phone, password } = req.body;

    if (!name || !phone || !password) {
      console.warn("⚠️ Campos obrigatórios faltando:", { hasName: !!name, hasPhone: !!phone, hasPassword: !!password });
      throw new AppError('Nome, telefone e senha são obrigatórios', 400);
    }

    // Validar força da senha
    const passwordValidation = validatePasswordStrength(password);
    console.log("🔐 Validação da senha:", passwordValidation);
    
    if (!passwordValidation.isValid) {
      console.warn("⚠️ Senha fraca:", passwordValidation.errors);
      throw new AppError(
        `Senha fraca. Requisitos: ${passwordValidation.errors.join('; ')}`,
        400
      );
    }

    // Verificar se telefone já existe
    const existingUser = await prisma.user.findUnique({
      where: { phone }
    });

    if (existingUser) {
      console.warn("⚠️ Telefone já existe:", phone);
      throw new AppError('Telefone já registrado', 409);
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        password: hashedPassword,
        role: 'client'
      }
    });

    console.log("✅ Usuário criado com sucesso:", user.id);

    const token = generateToken({ id: user.id, name: user.name, phone: user.phone, role: user.role });

    res.status(201).json({
      message: 'Usuário registrado com sucesso',
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error("❌ Erro no registro:", error);
    next(error);
  }
}

export async function barbershopRegister(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, phone, password } = req.body;

    if (!name || !phone || !password) {
      throw new AppError('Nome, telefone e senha são obrigatórios', 400);
    }

    // Validar força da senha
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      throw new AppError(
        `Senha fraca. Requisitos: ${passwordValidation.errors.join('; ')}`,
        400
      );
    }

    // Verificar se telefone já existe
    const existingUser = await prisma.user.findUnique({
      where: { phone }
    });

    if (existingUser) {
      throw new AppError('Telefone já registrado', 409);
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        password: hashedPassword,
        role: 'barbershop_owner'
      }
    });

    const token = generateToken({ id: user.id, name: user.name, phone: user.phone, role: user.role });

    res.status(201).json({
      message: 'Barbeiro registrado com sucesso',
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      throw new AppError('Telefone e senha são obrigatórios', 400);
    }

    const user = await prisma.user.findUnique({
      where: { phone }
    });

    if (!user) {
      throw new AppError('Credenciais inválidas', 401);
    }

    const passwordMatch = await comparePassword(password, user.password);

    if (!passwordMatch) {
      throw new AppError('Credenciais inválidas', 401);
    }

    const token = generateToken({
      id: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role
    });

    res.json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError('Não autorizado', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    res.json({
      id: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError('Não autorizado', 401);
    }

    const { name, phone } = req.body;

    // Validar campos
    if (!name || !phone) {
      throw new AppError('Nome e telefone são obrigatórios', 400);
    }

    // Se mudar telefone, verificar se já existe
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (user?.phone !== phone) {
      const existingPhone = await prisma.user.findUnique({
        where: { phone }
      });
      if (existingPhone) {
        throw new AppError('Telefone já registrado', 409);
      }
    }

    // Atualizar usuário
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, phone }
    });

    res.json({
      message: 'Perfil atualizado com sucesso',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        phone: updatedUser.phone,
        role: updatedUser.role
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function changePassword(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError('Não autorizado', 401);
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new AppError('Senha atual e nova são obrigatórias', 400);
    }

    // Validar força da nova senha
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      throw new AppError(
        `Senha fraca. Requisitos: ${passwordValidation.errors.join('; ')}`,
        400
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    // Verificar senha atual
    const passwordMatch = await comparePassword(currentPassword, user.password);
    if (!passwordMatch) {
      throw new AppError('Senha atual incorreta', 401);
    }

    // Atualizar para nova senha
    const hashedPassword = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword }
    });

    res.json({
      message: 'Senha alterada com sucesso'
    });
  } catch (error) {
    next(error);
  }
}

export async function requestPasswordReset(req: Request, res: Response, next: NextFunction) {
  try {
    const { phone } = req.body;

    if (!phone) {
      throw new AppError('Telefone é obrigatório', 400);
    }

    const user = await prisma.user.findUnique({
      where: { phone }
    });

    // Por segurança, não informar se o telefone existe ou não
    if (!user) {
      return res.json({
        message: 'Se esse telefone estiver registrado, você receberá um email'
      });
    }

    // Se não tem email, vamos usar uma url com token mesmo assim
    // Gerar token único
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hora

    // Deletar tokens antigos
    await prisma.passwordReset.deleteMany({
      where: { userId: user.id }
    });

    // Salvar novo token no banco
    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token,
        expiresAt
      }
    });

    // Log para desenvolvimento (em produção enviar email)
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/recuperar-senha?token=${token}`;
    console.log(`📧 Link de recuperação de senha para ${phone}:`);
    console.log(resetUrl);

    res.json({
      message: 'Se esse telefone estiver registrado, você receberá um email'
    });
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      throw new AppError('Token e nova senha são obrigatórios', 400);
    }

    // Validar força da senha
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      throw new AppError(
        `Senha fraca. Requisitos: ${passwordValidation.errors.join('; ')}`,
        400
      );
    }

    // Buscar token válido
    const resetRecord = await prisma.passwordReset.findUnique({
      where: { token }
    });

    if (!resetRecord) {
      throw new AppError('Token inválido', 400);
    }

    // Verificar expiração
    if (new Date() > resetRecord.expiresAt) {
      await prisma.passwordReset.delete({
        where: { token }
      });
      throw new AppError('Token expirado', 400);
    }

    // Atualizar senha
    const hashedPassword = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: resetRecord.userId },
      data: { password: hashedPassword }
    });

    // Deletar token usado
    await prisma.passwordReset.delete({
      where: { token }
    });

    res.json({
      message: 'Senha alterada com sucesso'
    });
  } catch (error) {
    next(error);
  }
}
