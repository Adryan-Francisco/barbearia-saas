import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase, saveDatabase } from '../utils/database';
import { AppError } from '../middleware/errorHandler';

export async function addFavorite(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError('Não autorizado', 401);
    }

    const { barbershopId } = req.body;

    if (!barbershopId) {
      throw new AppError('Barbershop ID é obrigatório', 400);
    }

    const db = await getDatabase();

    // Criar estrutura de favoritos se não existir
    if (!db.favorites) {
      db.favorites = [];
    }

    // Verificar se já é favorito
    const isFavorite = db.favorites.some(
      (fav: any) => fav.clientId === req.user?.id && fav.barbershopId === barbershopId
    );

    if (isFavorite) {
      throw new AppError('Barbearia já está nos favoritos', 409);
    }

    // Adicionar novo favorito
    db.favorites.push({
      id: uuidv4(),
      clientId: req.user.id,
      barbershopId,
      createdAt: new Date().toISOString(),
    });

    await saveDatabase(db);

    res.status(201).json({
      message: 'Adicionado aos favoritos',
      barbershopId,
    });
  } catch (error) {
    next(error);
  }
}

export async function removeFavorite(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError('Não autorizado', 401);
    }

    const { barbershopId } = req.params;

    const db = await getDatabase();

    if (!db.favorites) {
      throw new AppError('Nenhum favorito encontrado', 404);
    }

    const initialLength = db.favorites.length;
    db.favorites = db.favorites.filter(
      (fav: any) => !(fav.clientId === req.user?.id && fav.barbershopId === barbershopId)
    );

    if (db.favorites.length === initialLength) {
      throw new AppError('Favorito não encontrado', 404);
    }

    await saveDatabase(db);

    res.json({ message: 'Removido dos favoritos' });
  } catch (error) {
    next(error);
  }
}

export async function getFavorites(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError('Não autorizado', 401);
    }

    const db = await getDatabase();

    const favorites = db.favorites?.filter((fav: any) => fav.clientId === req.user?.id) || [];

    // Enriquecer com dados da barbearia
    const enrichedFavorites = favorites.map((fav: any) => {
      const barbershop = db.barbershops?.find((b: any) => b.id === fav.barbershopId);
      return {
        ...fav,
        barbershop,
      };
    });

    res.json({
      total: enrichedFavorites.length,
      favorites: enrichedFavorites,
    });
  } catch (error) {
    next(error);
  }
}

export async function isFavorite(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError('Não autorizado', 401);
    }

    const { barbershopId } = req.params;
    const db = await getDatabase();

    const isFav = db.favorites?.some(
      (fav: any) => fav.clientId === req.user?.id && fav.barbershopId === barbershopId
    ) || false;

    res.json({ barbershopId, isFavorite: isFav });
  } catch (error) {
    next(error);
  }
}
