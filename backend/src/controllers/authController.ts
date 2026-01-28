import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase, saveDatabase } from '../utils/database';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateToken } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, phone, password } = req.body;

    if (!name || !phone || !password) {
      throw new AppError('Nome, telefone e senha são obrigatórios', 400);
    }

    const db = await getDatabase();
    
    // Check if phone already exists
    if (db.users.find((u: any) => u.phone === phone)) {
      throw new AppError('Telefone já registrado', 409);
    }

    const hashedPassword = await hashPassword(password);
    const id = uuidv4();

    db.users.push({
      id,
      name,
      phone,
      password: hashedPassword,
      role: 'client',
      created_at: new Date(),
      updated_at: new Date()
    });

    await saveDatabase();

    const token = generateToken({ id, role: 'client' });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id, name, phone, role: 'client' }
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

    const db = await getDatabase();
    const user = db.users.find((u: any) => u.phone === phone);

    if (!user) {
      throw new AppError('Credenciais inválidas', 401);
    }

    const passwordMatch = await comparePassword(password, user.password);

    if (!passwordMatch) {
      throw new AppError('Credenciais inválidas', 401);
    }

    const token = generateToken({
      id: user.id,
      role: user.role
    });

    res.json({
      message: 'Login successful',
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

    const db = await getDatabase();
    const user = db.users.find((u: any) => u.id === req.user!.id);

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    res.json({
      id: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role
    });
  } catch (error) {
    next(error);
  }
}
