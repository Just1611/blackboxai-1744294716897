#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

clear

echo -e "${BLUE}=================================="
echo -e "  Instalador - Discord Server Cloner"
echo -e "==================================${NC}"
echo

# Detecta o sistema operacional
if [[ "$OSTYPE" == "darwin"* ]]; then
    OS="mac"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
else
    OS="unknown"
fi

# Verifica se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js não encontrado!${NC}"
    echo -e "${YELLOW}Por favor, instale o Node.js primeiro:${NC}"
    echo "https://nodejs.org/pt-br/download/"
    echo
    if [ "$OS" == "linux" ]; then
        echo -e "${YELLOW}Ou use o gerenciador de pacotes:${NC}"
        echo "Ubuntu/Debian: sudo apt install nodejs npm"
        echo "Fedora: sudo dnf install nodejs npm"
        echo "Arch Linux: sudo pacman -S nodejs npm"
    fi
    echo
    read -p "Pressione ENTER para sair..."
    exit 1
fi

# Verifica se o npm está instalado
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm não encontrado!${NC}"
    echo -e "${YELLOW}Por favor, reinstale o Node.js:${NC}"
    echo "https://nodejs.org/pt-br/download/"
    echo
    read -p "Pressione ENTER para sair..."
    exit 1
fi

echo -e "${GREEN}✓ Node.js encontrado${NC}"
echo -e "${GREEN}✓ npm encontrado${NC}"
echo

# Torna o script executável
chmod +x build.sh

echo -e "${BLUE}Instalando dependências...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}Erro ao instalar dependências!${NC}"
    read -p "Pressione ENTER para sair..."
    exit 1
fi

echo
echo -e "${BLUE}Gerando executável...${NC}"
if [ "$OS" == "mac" ]; then
    npm run build:mac
elif [ "$OS" == "linux" ]; then
    npm run build:linux
else
    echo -e "${RED}Sistema operacional não suportado!${NC}"
    read -p "Pressione ENTER para sair..."
    exit 1
fi

if [ $? -ne 0 ]; then
    echo -e "${RED}Erro ao gerar executável!${NC}"
    read -p "Pressione ENTER para sair..."
    exit 1
fi

echo
echo -e "${GREEN}=================================="
echo -e "      Instalação Concluída!"
echo -e "==================================${NC}"
echo
echo -e "${BLUE}O instalador foi gerado na pasta 'dist'${NC}"
echo

# Pergunta se quer abrir a pasta dist
read -p "Deseja abrir a pasta com o instalador agora? (S/N): " openDist
if [[ $openDist =~ ^[Ss]$ ]]; then
    if [ "$OS" == "mac" ]; then
        open dist
    else
        xdg-open dist &> /dev/null || nautilus dist &> /dev/null || dolphin dist &> /dev/null || thunar dist &> /dev/null || pcmanfm dist &> /dev/null
    fi
fi

echo
echo -e "${YELLOW}Próximos passos:${NC}"
if [ "$OS" == "mac" ]; then
    echo "1. Abra a pasta 'dist'"
    echo "2. Monte o arquivo .dmg"
    echo "3. Arraste o aplicativo para a pasta Aplicações"
elif [ "$OS" == "linux" ]; then
    echo "1. Abra a pasta 'dist'"
    echo "2a. Para .deb: sudo dpkg -i Discord.Server.Cloner.deb"
    echo "2b. Para AppImage: chmod +x Discord.Server.Cloner.AppImage"
    echo "                   ./Discord.Server.Cloner.AppImage"
fi
echo
echo -e "${YELLOW}Para mais informações, consulte o arquivo INSTALACAO.md${NC}"
echo

read -p "Pressione ENTER para sair..."
exit 0
