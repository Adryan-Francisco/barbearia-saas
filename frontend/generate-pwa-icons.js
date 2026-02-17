#!/usr/bin/env node

/**
 * Script para gerar ícones PWA automaticamente
 * 
 * Uso:
 * 1. Coloque uma imagem 512x512px em: frontend/public/icon-source.png
 * 2. Execute: node generate-pwa-icons.js
 * 3. Os ícones serão gerados em: frontend/public/icons/
 */

const fs = require('fs');
const path = require('path');

// Tentar importar sharp, com fallback para instruções
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('❌ Erro: sharp não está instalado');
  console.log('\nPara gerar ícones automaticamente, instale sharp:');
  console.log('  npm install --save-dev sharp\n');
  console.log('Ou use uma destas ferramentas online:');
  console.log('  • https://realfavicongenerator.net/');
  console.log('  • https://pwa-asset-generator.netlify.app/');
  console.log('  • https://maskable.app/editor\n');
  process.exit(1);
}

const sourceIcon = path.join(__dirname, 'public', 'icon-source.png');
const iconsDir = path.join(__dirname, 'public', 'icons');

// Criar diretório de ícones
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Tamanhos de ícones a gerar
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Verificar se arquivo de origem existe
if (!fs.existsSync(sourceIcon)) {
  console.error(`❌ Arquivo não encontrado: ${sourceIcon}`);
  console.log('\nColoque uma imagem 512x512px chamada "icon-source.png" em: frontend/public/\n');
  process.exit(1);
}

async function generateIcons() {
  try {
    console.log('🎨 Gerando ícones PWA...\n');

    // Gerar ícones regulares
    for (const size of sizes) {
      const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);
      
      await sharp(sourceIcon)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .toFile(outputPath);
      
      console.log(`✅ Criado: icon-${size}x${size}.png`);
    }

    // Gerar ícones maskable (adaptativos) - 192 e 512
    const maskableSizes = [192, 512];
    for (const size of maskableSizes) {
      const outputPath = path.join(iconsDir, `icon-${size}x${size}-maskable.png`);
      
      await sharp(sourceIcon)
        .resize(size, size, {
          fit: 'cover',
        })
        .toFile(outputPath);
      
      console.log(`✅ Criado: icon-${size}x${size}-maskable.png`);
    }

    console.log('\n✨ Ícones PWA gerados com sucesso!\n');
    console.log('📁 Localização: frontend/public/icons/\n');
    console.log('💡 Dicas:');
    console.log('  • Use ícones com fundo transparente para melhor resultado');
    console.log('  • Os ícones maskable são usados em dispositivos Android com tema de cores');
    console.log('  • Teste em https://maskable.app/ para visualizar o resultado\n');

  } catch (error) {
    console.error('❌ Erro ao gerar ícones:', error.message);
    process.exit(1);
  }
}

generateIcons();
