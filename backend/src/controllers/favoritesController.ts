import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
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

    // Verify barbershop exists
    const barbershop = await prisma.barbershop.findUnique({
      where: { id: barbershopId }
    });

    if (!barbershop) {
      throw new AppError('Barbearia não encontrada', 404);
    }

    // Check if already favorite
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_barbershopId: {
          userId: req.user.id,
          barbershopId
        }
      }
    });

    if (existing) {
      throw new AppError('Barbearia já está nos favoritos', 409);
    }

    await prisma.favorite.create({
      data: {
        userId: req.user.id,
        barbershopId
      }
    });

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

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_barbershopId: {
          userId: req.user.id,
          barbershopId
        }
      }
    });

    if (!favorite) {
      throw new AppError('Favorito não encontrado', 404);
    }

    await prisma.favorite.delete({
      where: {
        userId_barbershopId: {
          userId: req.user.id,
          barbershopId
        }
      }
    });

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

    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.id },
      include: { barbershop: true }
    });

    const enrichedFavorites = favorites.map((fav: typeof favorites[0]) => ({
      userId: fav.userId,
      barbershopId: fav.barbershopId,
      createdAt: fav.createdAt,
      barbershop: fav.barbershop,
    }));

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

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_barbershopId: {
          userId: req.user.id,
          barbershopId
        }
      }
    });

    res.json({ barbershopId, isFavorite: !!favorite });
  } catch (error) {
    next(error);
  }
}
