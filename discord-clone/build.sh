#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Discord Server Cloner - Script de Build${NC}\n"

# Detecta o sistema operacional
if [[ "$OSTYPE" == "darwin"* ]]; then
    OS="mac"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    OS="windows"
else
    OS="unknown"
fi

echo -e "Sistema Operacional detectado: ${GREEN}$OS${NC}\n"

# Verifica se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não encontrado. Por favor, instale o Node.js primeiro.${NC}"
    exit 1
fi

# Verifica se o npm está instalado
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm não encontrado. Por favor, instale o npm primeiro.${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Instalando dependências...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Falha ao instalar dependências${NC}"
    exit 1
fi

echo -e "\n${BLUE}🛠️ Iniciando build para $OS...${NC}"

# Build baseado no sistema operacional
case $OS in
    "mac")
        npm run build:mac
        ;;
    "linux")
        npm run build:linux
        ;;
    "windows")
        npm run build:win
        ;;
    *)
        echo -e "${RED}❌ Sistema operacional não suportado${NC}"
        exit 1
        ;;
esac

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Falha no build${NC}"
    exit 1
fi

echo -e "\n${GREEN}✅ Build concluído com sucesso!${NC}"
echo -e "\nArquivos gerados estão na pasta ${BLUE}dist/${NC}"

# Instruções pós-build
echo -e "\n${BLUE}📝 Próximos passos:${NC}"
case $OS in
    "mac")
        echo "1. Abra a pasta 'dist'"
        echo "2. Monte o arquivo .dmg"
        echo "3. Arraste o aplicativo para a pasta Aplicações"
        ;;
    "linux")
        echo "1. Para instalar o .deb:"
        echo "   sudo dpkg -i dist/*.deb"
        echo "2. Para executar o AppImage:"
        echo "   chmod +x dist/*.AppImage"
        echo "   ./dist/*.AppImage"
        ;;
    "windows")
        echo "1. Abra a pasta 'dist'"
        echo "2. Execute o instalador .exe"
        echo "3. Siga as instruções de instalação"
        ;;
esac

echo -e "\n${BLUE}💡 Para executar em modo de desenvolvimento:${NC}"
echo "npm run dev"

exit 0
