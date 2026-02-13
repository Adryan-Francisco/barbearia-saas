import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';

// CREATE - Criar novo serviço
export async function createService(req: Request, res: Response, next: NextFunction) {
  try {
    const { barbershop_id } = req.params;
    const { name, description, price, duration } = req.body;
    const userId = (req as any).userId;

    if (!userId) {
      throw new AppError('Usuário não autenticado', 401);
    }

    if (!barbershop_id || !name || price === undefined || !duration) {
      throw new AppError('ID da barbearia, nome, preço e duração são obrigatórios', 400);
    }

    // Verificar se a barbearia existe e se o usuário é o proprietário
    const barbershop = await prisma.barbershop.findUnique({
      where: { id: barbershop_id }
    });

    if (!barbershop) {
      throw new AppError('Barbearia não encontrada', 404);
    }

    if (barbershop.ownerId !== userId) {
      throw new AppError('Você não tem permissão para adicionar serviços a esta barbearia', 403);
    }

    const service = await prisma.service.create({
      data: {
        barbershopId: barbershop_id,
        name,
        description: description || null,
        price: parseFloat(price as string),
        duration: parseInt(duration as string)
      }
    });

    res.status(201).json({
      message: 'Serviço criado com sucesso',
      service: {
        id: service.id,
        name: service.name,
        description: service.description,
        price: service.price,
        duration: service.duration,
        createdAt: service.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
}

// READ - Obter serviços de uma barbearia
export async function getServicesByBarbershop(req: Request, res: Response, next: NextFunction) {
  try {
    const { barbershop_id } = req.params;

    if (!barbershop_id) {
      throw new AppError('ID da barbearia é obrigatório', 400);
    }

    const barbershop = await prisma.barbershop.findUnique({
      where: { id: barbershop_id },
      include: { services: true }
    });

    if (!barbershop) {
      throw new AppError('Barbearia não encontrada', 404);
    }

    res.json({
      services: barbershop.services
    });
  } catch (error) {
    next(error);
  }
}

// READ - Obter um serviço específico
export async function getServiceById(req: Request, res: Response, next: NextFunction) {
  try {
    const { service_id } = req.params;

    if (!service_id) {
      throw new AppError('ID do serviço é obrigatório', 400);
    }

    const service = await prisma.service.findUnique({
      where: { id: service_id },
      include: { barbershop: true }
    });

    if (!service) {
      throw new AppError('Serviço não encontrado', 404);
    }

    res.json({
      service
    });
  } catch (error) {
    next(error);
  }
}

// UPDATE - Atualizar serviço
export async function updateService(req: Request, res: Response, next: NextFunction) {
  try {
    const { service_id } = req.params;
    const { name, description, price, duration } = req.body;
    const userId = (req as any).userId;

    if (!userId) {
      throw new AppError('Usuário não autenticado', 401);
    }

    if (!service_id) {
      throw new AppError('ID do serviço é obrigatório', 400);
    }

    // Verificar se o serviço existe e se o usuário tem permissão
    const service = await prisma.service.findUnique({
      where: { id: service_id },
      include: { barbershop: true }
    });

    if (!service) {
      throw new AppError('Serviço não encontrado', 404);
    }

    if (service.barbershop.ownerId !== userId) {
      throw new AppError('Você não tem permissão para editar este serviço', 403);
    }

    // Atualizar apenas os campos fornecidos
    const updateData: any = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price as string);
    if (duration !== undefined) updateData.duration = parseInt(duration as string);

    const updated = await prisma.service.update({
      where: { id: service_id },
      data: updateData
    });

    res.json({
      message: 'Serviço atualizado com sucesso',
      service: {
        id: updated.id,
        name: updated.name,
        description: updated.description,
        price: updated.price,
        duration: updated.duration,
        createdAt: updated.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
}

// DELETE - Deletar serviço
export async function deleteService(req: Request, res: Response, next: NextFunction) {
  try {
    const { service_id } = req.params;
    const userId = (req as any).userId;

    if (!userId) {
      throw new AppError('Usuário não autenticado', 401);
    }

    if (!service_id) {
      throw new AppError('ID do serviço é obrigatório', 400);
    }

    // Verificar se o serviço existe e se o usuário tem permissão
    const service = await prisma.service.findUnique({
      where: { id: service_id },
      include: { barbershop: true }
    });

    if (!service) {
      throw new AppError('Serviço não encontrado', 404);
    }

    if (service.barbershop.ownerId !== userId) {
      throw new AppError('Você não tem permissão para deletar este serviço', 403);
    }

    await prisma.service.delete({
      where: { id: service_id }
    });

    res.json({
      message: 'Serviço deletado com sucesso'
    });
  } catch (error) {
    next(error);
  }
}
