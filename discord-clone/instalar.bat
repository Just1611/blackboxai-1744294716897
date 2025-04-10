@echo off
setlocal enabledelayedexpansion

echo [94m==================================[0m
echo [94m  Instalador - Discord Server Cloner[0m
echo [94m==================================[0m
echo.

:: Verifica se o Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [91mNode.js não encontrado![0m
    echo [93mPor favor, instale o Node.js primeiro:[0m
    echo https://nodejs.org/pt-br/download/
    echo.
    pause
    exit /b 1
)

:: Verifica se o npm está instalado
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [91mnpm não encontrado![0m
    echo [93mPor favor, reinstale o Node.js:[0m
    echo https://nodejs.org/pt-br/download/
    echo.
    pause
    exit /b 1
)

echo [92m✓ Node.js encontrado[0m
echo [92m✓ npm encontrado[0m
echo.

echo [94mInstalando dependências...[0m
call npm install
if %ERRORLEVEL% neq 0 (
    echo [91mErro ao instalar dependências![0m
    pause
    exit /b 1
)

echo.
echo [94mGerando executável...[0m
call npm run build:win
if %ERRORLEVEL% neq 0 (
    echo [91mErro ao gerar executável![0m
    pause
    exit /b 1
)

echo.
echo [92m==================================[0m
echo [92m      Instalação Concluída![0m
echo [92m==================================[0m
echo.
echo [94mO instalador foi gerado na pasta 'dist'[0m
echo.

:: Pergunta se quer abrir a pasta dist
set /p "openDist=Deseja abrir a pasta com o instalador agora? (S/N): "
if /i "!openDist!"=="S" (
    start "" "dist"
)

echo.
echo [93mPróximos passos:[0m
echo 1. Abra a pasta 'dist'
echo 2. Execute o arquivo Discord.Server.Cloner.Setup.exe
echo 3. Siga as instruções do instalador
echo.
echo [93mPara mais informações, consulte o arquivo INSTALACAO.md[0m
echo.

pause
exit /b 0
