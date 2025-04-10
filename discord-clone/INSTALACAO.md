# 📥 Guia de Instalação - Clonador de Servidor Discord

## Método 1: Instalação Direta (Mais Fácil)

### Windows:
1. Faça o download do arquivo `Discord.Server.Cloner.Setup.exe` da [página de releases](../../releases)
2. Execute o arquivo baixado
3. Siga as instruções do instalador
4. O programa estará disponível no Menu Iniciar como "Discord Server Cloner"

### macOS:
1. Faça o download do arquivo `Discord.Server.Cloner.dmg` da [página de releases](../../releases)
2. Abra o arquivo .dmg
3. Arraste o aplicativo para a pasta Aplicações
4. Abra o aplicativo pela primeira vez clicando com botão direito > Abrir

### Linux:
1. Faça o download do arquivo `Discord.Server.Cloner.AppImage` da [página de releases](../../releases)
2. Abra o terminal na pasta onde baixou o arquivo
3. Torne o arquivo executável:
   ```bash
   chmod +x Discord.Server.Cloner.AppImage
   ```
4. Execute o aplicativo:
   ```bash
   ./Discord.Server.Cloner.AppImage
   ```

## Método 2: Instalação via Código Fonte

Se você é desenvolvedor ou quer modificar o código, siga estes passos:

### Pré-requisitos:
- Node.js (versão 14 ou superior)
- npm (normalmente vem com Node.js)
- Git

### Windows:
1. Abra o PowerShell ou CMD
2. Clone o repositório:
   ```bash
   git clone [URL-DO-REPOSITÓRIO]
   cd discord-clone
   ```
3. Execute o script de build:
   ```bash
   .\build.bat
   ```
4. O instalador será gerado na pasta `dist`

### macOS/Linux:
1. Abra o Terminal
2. Clone o repositório:
   ```bash
   git clone [URL-DO-REPOSITÓRIO]
   cd discord-clone
   ```
3. Torne o script executável e execute:
   ```bash
   chmod +x build.sh
   ./build.sh
   ```
4. O instalador será gerado na pasta `dist`

## ❓ Resolução de Problemas

### O aplicativo não abre:
- Verifique se tem o Node.js instalado
- Tente executar como administrador
- Verifique se há algum antivírus bloqueando

### Erro durante a instalação:
- Certifique-se de ter permissões de administrador
- Verifique se há espaço suficiente no disco
- Desative temporariamente o antivírus

### Erro de "Aplicativo não verificado":
- Windows: Clique em "Mais informações" > "Executar assim mesmo"
- macOS: Clique com botão direito > Abrir
- Linux: Certifique-se que o arquivo tem permissão de execução

## 🔒 Segurança

- O aplicativo é seguro e código-aberto
- Não requer permissões administrativas do Discord
- Seu token é armazenado apenas localmente
- Não envia dados para servidores externos

## 📞 Suporte

Se encontrar problemas:
1. Verifique este guia de instalação
2. Consulte a [seção de issues](../../issues)
3. Abra uma nova issue descrevendo seu problema

## ⚠️ Notas Importantes

- Mantenha seu token do Discord seguro
- Não compartilhe seu token com ninguém
- Use o aplicativo de forma responsável
- Faça backup do servidor de destino antes de clonar

## 🔄 Atualizações

- O aplicativo verificará automaticamente por atualizações
- Você será notificado quando houver uma nova versão
- Sempre use a versão mais recente para maior segurança
