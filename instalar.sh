#!/bin/bash
# ========================================
# CRM Super - Instalacao Automatica
# ========================================
echo "========================================"
echo "  CRM Super - Instalacao Automatica"
echo "========================================"
echo ""

# Verificar se o Node.js está instalado
echo "[1/5] Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "ERRO: Node.js não encontrado!"
    echo "Por favor, instale o Node.js em: https://nodejs.org/"
    exit 1
fi
echo "[OK] Node.js encontrado: $(node --version)"

# Instalar dependências
echo ""
echo "[2/5] Instalando dependencias (pode demorar alguns minutos)..."
npm install --legacy-peer-deps
if [ $? -ne 0 ]; then
    echo "ERRO: Falha ao instalar dependencias!"
    exit 1
fi
echo "[OK] Dependencias instaladas"

# Compilar o projeto
echo ""
echo "[3/5] Compilando o projeto..."
npm run build
if [ $? -ne 0 ]; then
    echo "ERRO: Falha ao compilar o projeto!"
    exit 1
fi
echo "[OK] Projeto compilado"

# Verificar instalação
echo ""
echo "[4/5] Verificando instalacao..."
if [ -f "dist/index.html" ]; then
    echo "[OK] Build concluído com sucesso!"
else
    echo "AVISO: Build pode ter falhado, mas o projeto pode funcionar em modo dev"
fi

echo ""
echo "========================================"
echo "  INSTALACAO CONCLUIDA!"
echo "========================================"
echo ""
echo "Para iniciar o projeto, execute:"
echo "  npm run dev"
echo ""
echo "Depois acesse: http://localhost:5173"
echo ""
echo "Credenciais de acesso:"
echo "  Usuario: marina@crmsuper.example"
echo "  Senha: 123456"
echo "  Cargo: Administrador"
echo ""
echo "Outros usuarios disponíveis:"
echo "  lucas@crmsuper.example - Vendedor"
echo "  pedro@crmsuper.example - Tecnico"
echo "  ana@crmsuper.example   - Designer"
echo "  roberto@crmsuper.example - Financeiro"
echo "  Senha para todos: 123456"