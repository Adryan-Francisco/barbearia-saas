import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';

// Caminho do package.json
const packageJsonPath = path.join(__dirname, '../../package.json');

export async function getSystemVersion(_req: Request, res: Response, next: NextFunction) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const version = packageJson.version;
    const [major, minor, patch] = version.split('.').map(Number);

    res.json({
      version,
      major,
      minor,
      patch,
      buildTime: fs.statSync(packageJsonPath).mtime,
    });
  } catch (error) {
    next(error);
  }
}

export async function incrementVersion(_req: Request, res: Response, next: NextFunction) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const [major, minor, patch] = packageJson.version.split('.').map(Number);
    
    // Incrementa versão patch
    const newVersion = `${major}.${minor}.${patch + 1}`;
    packageJson.version = newVersion;
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    
    const [newMajor, newMinor, newPatch] = newVersion.split('.').map(Number);

    res.json({
      message: 'Versão incrementada com sucesso',
      version: newVersion,
      major: newMajor,
      minor: newMinor,
      patch: newPatch,
    });
  } catch (error) {
    next(error);
  }
}

