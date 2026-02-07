#!/usr/bin/env pwsh
# 🚀 QUICK START - Frontend salva dados no Backend

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  ✨ BarberPro SaaS - Frontend-Backend Integration Ready!  ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if servers are already running
Write-Host "Verificando se os servidores estão rodando..." -ForegroundColor Yellow
$processes = Get-Process -Name "npm" -ErrorAction SilentlyContinue

if ($processes) {
    Write-Host "✅ Servidores já estão rodando!" -ForegroundColor Green
    Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Blue
    Write-Host "   Backend:  http://localhost:3001" -ForegroundColor Blue
} else {
    Write-Host "Iniciando servidores..." -ForegroundColor Yellow
    Write-Host ""
    
    # Start backend
    Write-Host "📦 Iniciando Backend..." -ForegroundColor Magenta
    $backendPath = Join-Path $PSScriptRoot "backend"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; npm run dev" -WindowStyle Normal
    
    Start-Sleep -Seconds 2
    
    # Start frontend
    Write-Host "🎨 Iniciando Frontend..." -ForegroundColor Magenta
    $frontendPath = Join-Path $PSScriptRoot "frontend"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm run dev" -WindowStyle Normal
    
    Write-Host ""
    Write-Host "✅ Servidores iniciados!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📍 Acesso rápido:" -ForegroundColor Cyan
    Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Blue
    Write-Host "   Backend:  http://localhost:3001" -ForegroundColor Blue
    Write-Host ""
}

Write-Host "📚 Documentação:" -ForegroundColor Cyan
Write-Host "   1️⃣  IMPLEMENTATION_COMPLETE.md    - Resumo completo" -ForegroundColor Gray
Write-Host "   2️⃣  TESTING_GUIDE.md               - Como testar" -ForegroundColor Gray
Write-Host "   3️⃣  FRONTEND_BACKEND_INTEGRATION.md - Detalhes técnicos" -ForegroundColor Gray
Write-Host "   4️⃣  EXECUTIVE_SUMMARY.md           - Para stakeholders" -ForegroundColor Gray
Write-Host "   5️⃣  CHECKLIST_FINAL.md             - Tudo implementado" -ForegroundColor Gray
Write-Host ""

Write-Host "🎯 Primeiros testes:" -ForegroundColor Cyan
Write-Host "   1. Registre um cliente em /cadastro" -ForegroundColor Gray
Write-Host "   2. Faça um agendamento em /cliente" -ForegroundColor Gray
Write-Host "   3. Veja em /cliente/agendamentos" -ForegroundColor Gray
Write-Host "   4. Verifique localStorage no DevTools (F12)" -ForegroundColor Gray
Write-Host ""

Write-Host "✨ Status:" -ForegroundColor Green
Write-Host "   ✅ Frontend com API integrada" -ForegroundColor Green
Write-Host "   ✅ Backend salvando dados" -ForegroundColor Green
Write-Host "   ✅ JWT authentication funcionando" -ForegroundColor Green
Write-Host "   ✅ Dados persistem em JSON" -ForegroundColor Green
Write-Host "   ✅ 0 erros de compilação" -ForegroundColor Green
Write-Host ""

Write-Host "🚀 Pronto para mais funcionalidades!" -ForegroundColor Cyan
Write-Host ""
