#!/usr/bin/env node

/**
 * Auto-version hook
 * Incrementa automaticamente a versão no backend antes de cada commit
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const backendPackagePath = path.join(__dirname, '../backend/package.json');
const bumpVersionPath = path.join(__dirname, '../backend/scripts/bump-version.js');

try {
  // Executar bump-version script
  if (fs.existsSync(bumpVersionPath)) {
    console.log('🔄 Auto-incrementando versão...');
    execSync(`node "${bumpVersionPath}"`, { 
      stdio: 'pipe',
      cwd: path.join(__dirname, '../backend')
    });

    // Adicionar package.json ao stage se foi modificado
    try {
      execSync('git diff --exit-code backend/package.json', { stdio: 'pipe' });
    } catch (e) {
      // Se o arquivo foi modificado, adicionar ao stage
      if (e.status === 1) {
        console.log('✅ package.json atualizado, adicionando ao commit...');
        execSync('git add backend/package.json');
      }
    }
  }
} catch (error) {
  // Falhas no versionamento não devem bloquear o commit
  console.warn('⚠️  Erro ao auto-incrementar versão (ignorado):', error.message);
  process.exit(0);
}

process.exit(0);
