import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';

// Caminho do package.json - usar process.cwd() para ser mais robusto
const getPackageJsonPath = () => {
  // Tenta vários caminhos possíveis
  const possiblePaths = [
    path.join(process.cwd(), 'package.json'), // Home do servidor
    path.join(__dirname, '../../package.json'), // Relativo de dist/controllers
    path.join(__dirname, '../../../package.json'), // Se executado de outro lugar
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  // Fallback - retorna o primeiro mesmo se não existir
  return possiblePaths[0];
};

export async function getSystemVersion(_req: Request, res: Response, next: NextFunction) {
  try {
    const packageJsonPath = getPackageJsonPath();
    console.log('📦 Lendo package.json de:', packageJsonPath);
    
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error(`package.json não encontrado em ${packageJsonPath}`);
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const version = packageJson.version;
    const [major, minor, patch] = version.split('.').map(Number);

    console.log('✅ Versão encontrada:', version);

    res.json({
      version,
      major,
      minor,
      patch,
      buildTime: fs.statSync(packageJsonPath).mtime,
    });
  } catch (error) {
    console.error('❌ Erro ao buscar versão:', error);
    next(error);
  }
}

export async function incrementVersion(_req: Request, res: Response, next: NextFunction) {
  try {
    const packageJsonPath = getPackageJsonPath();
    console.log('📦 Incrementando versão em:', packageJsonPath);
    
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error(`package.json não encontrado em ${packageJsonPath}`);
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const [major, minor, patch] = packageJson.version.split('.').map(Number);
    
    // Incrementa versão patch
    const newVersion = `${major}.${minor}.${patch + 1}`;
    packageJson.version = newVersion;
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log(`✅ Versão atualizada: ${major}.${minor}.${patch} → ${newVersion}`);
    
    const [newMajor, newMinor, newPatch] = newVersion.split('.').map(Number);

    res.json({
      message: 'Versão incrementada com sucesso',
      version: newVersion,
      major: newMajor,
      minor: newMinor,
      patch: newPatch,
    });
  } catch (error) {
    console.error('❌ Erro ao incrementar versão:', error);
    next(error);
  }
}

