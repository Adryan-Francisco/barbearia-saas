#!/bin/bash
# Script para verificar conexão entre frontend e backend

echo "🔍 Verificando conexão Frontend + Backend"
echo "========================================="
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se backend está rodando
echo "1️⃣  Testando Backend (http://localhost:3001/api/health)..."
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/health)

if [ "$BACKEND_STATUS" = "200" ]; then
  echo -e "${GREEN}✅ Backend está rodando${NC}"
else
  echo -e "${RED}❌ Backend não respondeu (HTTP $BACKEND_STATUS)${NC}"
  echo -e "${YELLOW}⚠️  Inicie o backend com: cd backend && npm run dev${NC}"
fi

echo ""

# Verificar se frontend está rodando
echo "2️⃣  Testando Frontend (http://localhost:3000)..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)

if [ "$FRONTEND_STATUS" = "200" ]; then
  echo -e "${GREEN}✅ Frontend está rodando${NC}"
else
  echo -e "${RED}❌ Frontend não respondeu (HTTP $FRONTEND_STATUS)${NC}"
  echo -e "${YELLOW}⚠️  Inicie o frontend com: cd frontend && npm run dev${NC}"
fi

echo ""

# Testar comunicação
if [ "$BACKEND_STATUS" = "200" ] && [ "$FRONTEND_STATUS" = "200" ]; then
  echo -e "${GREEN}🎉 Ambos servidores estão rodando!${NC}"
  echo ""
  echo "📱 Acesse o frontend em: http://localhost:3000"
  echo "🔌 API disponível em: http://localhost:3001/api"
  echo ""
  echo "✨ Sua aplicação está pronta para usar!"
else
  echo -e "${RED}⚠️  Alguns servidores não estão rodando${NC}"
fi

echo ""
