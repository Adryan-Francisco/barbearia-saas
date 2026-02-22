#!/usr/bin/env node

/**
 * Git Auto-Version Commit
 * 
 * Incrementa versão automaticamente e faz commit
 * 
 * Uso:
 *   node scripts/auto-commit.js "mensagem do commit"
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const args = process.argv.slice(2);
const commitMessage = args.join(' ') || 'chore: auto-updated version';

try {
  console.log('\n🚀 Iniciando commit automático com versionamento...\n');

  // 1. Incrementar versão
  console.log('📦 Bumping version...');
  const bumpVersionPath = path.join(__dirname, 'bump-version.js');
  execSync(`node "${bumpVersionPath}"`, { stdio: 'inherit' });

  // Voltar para raiz do repositório
  const backendDir = path.dirname(path.dirname(__filename));
  const repoRoot = path.dirname(backendDir);
  process.chdir(repoRoot);

  // 2. Stage changes
  console.log('\n📝 Staging backend/package.json...');
  execSync('git add backend/package.json', { stdio: 'inherit' });

  // 3. Stage outros arquivos modificados
  console.log('📝 Staging changes...');
  execSync('git add .', { stdio: 'inherit' });

  // 4. Commit
  console.log(`\n✍️  Committing: "${commitMessage}"...\n`);
  execSync(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`, { stdio: 'inherit' });

  // 5. Push
  console.log('\n⬆️  Pushing to remote...');
  try {
    execSync('git push', { stdio: 'inherit' });
    console.log('\n✅ SUCESSO! Version bumped, committed and pushed!\n');
  } catch (e) {
    console.log('\n⚠️  Commit realizado mas push falhou (remoto pode estar indisponível).\n');
  }

} catch (error) {
  console.error('\n❌ Erro:', error.message, '\n');
  process.exit(1);
}
