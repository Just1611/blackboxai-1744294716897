@echo off
setlocal enabledelayedexpansion

echo [94m🚀 Discord Server Cloner - Script de Build[0m

:: Verifica se o Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [91m❌ Node.js não encontrado. Por favor, instale o Node.js primeiro.[0m
    exit /b 1
)

:: Verifica se o npm está instalado
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [91m❌ npm não encontrado. Por favor, instale o npm primeiro.[0m
    exit /b 1
)

echo.
echo [94m📦 Instalando dependências...[0m
call npm install
if %ERRORLEVEL% neq 0 (
    echo [91m❌ Falha ao instalar dependências[0m
    exit /b 1
)

echo.
echo [94m🛠️ Iniciando build para Windows...[0m
call npm run build:win
if %ERRORLEVEL% neq 0 (
    echo [91m❌ Falha no build[0m
    exit /b 1
)

echo.
echo [92m✅ Build concluído com sucesso![0m
echo.
echo Arquivos gerados estão na pasta [94mdist\[0m

echo.
echo [94m📝 Próximos passos:[0m
echo 1. Abra a pasta 'dist'
echo 2. Execute o instalador .exe
echo 3. Siga as instruções de instalação

echo.
echo [94m💡 Para executar em modo de desenvolvimento:[0m
echo npm run dev

:: Pergunta se deseja abrir a pasta dist
echo.
set /p "openDist=Deseja abrir a pasta dist agora? (S/N): "
if /i "!openDist!"=="S" (
    start "" "dist"
)

exit /b 0
