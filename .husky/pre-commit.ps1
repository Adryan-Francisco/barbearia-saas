# Pre-commit hook para incrementar versão automaticamente
# Executar automaticamente: node .husky/pre-commit.js

$ErrorActionPreference = 'Continue'

$backendPath = Join-Path (Get-Location) "backend"
$bumpScript = Join-Path $backendPath "scripts\bump-version.js"

if (Test-Path $bumpScript) {
    Write-Host "🔄 Auto-incrementando versão..."
    
    try {
        Push-Location $backendPath
        & node scripts/bump-version.js 2>$null
        Pop-Location
        
        # Verificar se package.json foi modificado
        $modified = git diff --name-only | Select-String "backend/package.json"
        
        if ($modified) {
            Write-Host "✅ package.json atualizado, adicionando ao commit..."
            git add backend/package.json
        }
    }
    catch {
        Write-Warning "⚠️  Erro ao auto-incrementar versão: $_"
        Pop-Location
    }
}

exit 0
