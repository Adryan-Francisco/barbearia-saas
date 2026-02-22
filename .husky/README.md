# 🔄 Versionamento Automático

Este projeto tem suporte a versionamento automático de duas formas:

## 📌 Método 1: Commit Automático (Recomendado)

```bash
cd backend

# Incrementa versão, commita e faz push
npm run commit "sua mensagem de commit aqui"

# Exemplo:
npm run commit "feat: adicionar novo endpoint"
```

**O que faz:**
1. ✅ Incrementa a versão (1.0.4 → 1.0.5)
2. ✅ Stage do `backend/package.json`
3. ✅ Adiciona outros arquivos modificados
4. ✅ Faz commit com sua mensagem
5. ✅ Faz push para o repositório remoto

---

## 📌 Método 2: Incrementar Versão Manualmente

```bash
cd backend

# Apenas incrementa a versão
npm run version:bump

# Depois faça commit normal
git add .
git commit -m "sua mensagem"
git push
```

---

## 📌 Método 3: Git Hook Automático (Configuração Local)

Se você quer que a versão seja incrementada **automaticamente** em cada commit (sem precisar usar `npm run commit`), configure o git hook localmente:

### No Windows (PowerShell):
```powershell
cd c:\Users\adrya\Documents\Projetos\barbearia-saas
mkdir -p .git/hooks
Copy-Item .\.husky\pre-commit.ps1 -Destination .\.git\hooks\pre-commit
```

### No Linux/Mac (Bash):
```bash
cd ~/Projetos/barbearia-saas
mkdir -p .git/hooks
cp .husky/pre-commit.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

**Após configurar:** Toda vez que fizer `git commit`, a versão será incrementada automaticamente!

---

## ✅ Versão Atual

Para ver a versão atual:
```bash
cd backend
cat package.json | grep version
```

---

## 🎯 Boas Práticas

- ✅ Use `npm run commit "mensagem"` para todos os commits
- ✅ Mensagens de commit devem seguir: `tipo: descrição`
  - `feat:` para novas funcionalidades
  - `fix:` para correções de bugs
  - `chore:` para tarefas administrativas
  - `docs:` para documentação
  - `test:` para testes

---

## 📊 Histórico de Versões

```bash
cd backend
git log --oneline | grep "version"
```

