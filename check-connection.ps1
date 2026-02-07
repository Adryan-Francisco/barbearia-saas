# Script para verificar conexão entre frontend e backend (Windows)

Write-Host "🔍 Verificando conexão Frontend + Backend" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Função para testar URL
function Test-UrlResponse {
    param([string]$Url)
    try {
        $response = Invoke-WebRequest -Uri $Url -TimeoutSec 3 -ErrorAction Stop
        return $response.StatusCode
    }
    catch {
        return $_.Exception.Response.StatusCode.value__
    }
}

# Verificar Backend
Write-Host "1️⃣  Testando Backend (http://localhost:3001/api/health)..." -ForegroundColor Yellow
$backendStatus = Test-UrlResponse -Url "http://localhost:3001/api/health"

if ($backendStatus -eq 200) {
    Write-Host "✅ Backend está rodando" -ForegroundColor Green
    $backendOk = $true
} else {
    Write-Host "❌ Backend não respondeu (HTTP $backendStatus)" -ForegroundColor Red
    Write-Host "⚠️  Inicie o backend com: cd backend && npm run dev" -ForegroundColor Yellow
    $backendOk = $false
}

Write-Host ""

# Verificar Frontend
Write-Host "2️⃣  Testando Frontend (http://localhost:3000)..." -ForegroundColor Yellow
$frontendStatus = Test-UrlResponse -Url "http://localhost:3000"

if ($frontendStatus -eq 200) {
    Write-Host "✅ Frontend está rodando" -ForegroundColor Green
    $frontendOk = $true
} else {
    Write-Host "❌ Frontend não respondeu (HTTP $frontendStatus)" -ForegroundColor Red
    Write-Host "⚠️  Inicie o frontend com: cd frontend && npm run dev" -ForegroundColor Yellow
    $frontendOk = $false
}

Write-Host ""

# Resultado final
if ($backendOk -and $frontendOk) {
    Write-Host "🎉 Ambos servidores estão rodando!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📱 Acesse o frontend em: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "🔌 API disponível em: http://localhost:3001/api" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "✨ Sua aplicação está pronta para usar!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Alguns servidores não estão rodando" -ForegroundColor Red
}

Write-Host ""
Read-Host "Pressione Enter para sair"
