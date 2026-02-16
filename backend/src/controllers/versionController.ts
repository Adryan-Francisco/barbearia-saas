import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';

export async function getSystemVersion(_req: Request, res: Response, next: NextFunction) {
  try {
    let version = await prisma.systemVersion.findFirst();

    // Se não existir, criar a versão inicial
    if (!version) {
      version = await prisma.systemVersion.create({
        data: {
          major: 0,
          minor: 1,
          patch: 0,
          migration: 0,
        },
      });
    }

    const versionString = `${version.major}.${version.minor}.${version.patch}`;

    res.json({
      version: versionString,
      major: version.major,
      minor: version.minor,
      patch: version.patch,
      migration: version.migration,
      fullVersion: version,
    });
  } catch (error) {
    next(error);
  }
}

export async function incrementVersion(_req: Request, res: Response, next: NextFunction) {
  try {
    let version = await prisma.systemVersion.findFirst();

    if (!version) {
      version = await prisma.systemVersion.create({
        data: {
          major: 0,
          minor: 1,
          patch: 1,
          migration: 1,
        },
      });
    } else {
      version = await prisma.systemVersion.update({
        where: { id: version.id },
        data: {
          migration: version.migration + 1,
          patch: version.patch + 1,
        },
      });
    }

    const versionString = `${version.major}.${version.minor}.${version.patch}`;

    res.json({
      message: 'Versão incrementada com sucesso',
      version: versionString,
      fullVersion: version,
    });
  } catch (error) {
    next(error);
  }
}
