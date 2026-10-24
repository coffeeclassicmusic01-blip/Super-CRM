@echo off
echo ========================================
echo   CRM Super - Instalacao Automatica
echo ========================================
echo.

echo [1/5] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao encontrado!
    echo Por favor, instale o Node.js em: https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js encontrado

echo.
echo [2/5] Instalando dependencias (pode demorar alguns minutos)...
npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo ERRO: Falha ao instalar dependencias!
    pause
    exit /b 1
)
echo [OK] Dependencias instaladas

echo.
echo [3/5] Compilando o projeto...
npm run build
if %errorlevel% neq 0 (
    echo ERRO: Falha ao compilar o projeto!
    pause
    exit /b 1
)
echo [OK] Projeto compilado

echo.
echo [4/5] Verificando instalacao...
if exist "dist/index.html" (
    echo [OK] Build concluido com sucesso!
) else (
    echo AVISO: Build pode ter falhado, mas o projeto pode funcionar em modo dev
)

echo.
echo [5/5] Projeto pronto!
echo.
echo ========================================
echo   INSTALACAO CONCLUIDA!
echo ========================================
echo.
echo Para iniciar o projeto, execute:
>npm run dev
echo.
echo Depois acesse: http://localhost:5173
echo.
echo Credenciais de acesso:
echo   Usuario: marina@crmsuper.example
echo   Senha: 123456
echo   Cargo: Administrador
echo.
echo Outros usuarios disponiveis:
echo   lucas@crmsuper.example - Vendedor
|       pedro@crmsuper.example - Tecnico
|       ana@crmsuper.example   - Designer
|       roberto@crmsuper.example - Financeiro
|       Senha para todos: 123456
echo.
echo Pressione qualquer tecla para sair...
pause >nul