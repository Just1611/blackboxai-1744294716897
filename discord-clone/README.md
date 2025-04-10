# Clonador de Servidor Discord

Uma aplicação desktop para clonar servidores do Discord sem necessidade de permissões especiais ou bots.

## 🚀 Funcionalidades

- Clone completo da estrutura do servidor
- Canais de texto, voz e fórum
- Categorias e organização
- Emojis do servidor
- Sem necessidade de bot ou permissões especiais
- Interface em português
- Limpeza automática do servidor de destino

## 📥 Download e Instalação

### Windows
1. Faça o download do instalador `.exe` mais recente da seção [Releases](../../releases)
2. Execute o instalador
3. Siga as instruções de instalação
4. Inicie o "Discord Server Cloner" através do menu Iniciar

### macOS
1. Faça o download do arquivo `.dmg` mais recente da seção [Releases](../../releases)
2. Abra o arquivo .dmg
3. Arraste o aplicativo para a pasta Aplicações
4. Inicie o "Discord Server Cloner" através do Launchpad

### Linux
1. Faça o download do arquivo `.AppImage` mais recente da seção [Releases](../../releases)
2. Torne o arquivo executável: `chmod +x Discord.Server.Cloner.AppImage`
3. Execute o arquivo AppImage

## 💻 Desenvolvimento

Se quiser executar o código fonte:

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/discord-server-cloner.git

# Entre na pasta
cd discord-server-cloner

# Instale as dependências
npm install

# Execute em modo de desenvolvimento
npm run dev

# Ou compile para sua plataforma
npm run build
```

## 📝 Como Usar

1. Inicie o aplicativo
2. Insira seu token de utilizador do Discord
3. Cole o ID ou link do servidor que deseja clonar
4. Cole o ID do servidor de destino
5. Confirme o aviso de limpeza do servidor
6. Clique em "Iniciar Clonagem"

### Como obter o token de utilizador:
1. Abra o Discord no navegador
2. Pressione F12 para abrir as ferramentas de desenvolvedor
3. Vá para a aba "Network"
4. Procure por qualquer requisição para discord.com
5. Nos cabeçalhos da requisição, procure por "authorization"
6. Copie o valor do token

### Como obter o ID do servidor:
1. Ative o "Modo Desenvolvedor" nas configurações do Discord
2. Clique com o botão direito no servidor
3. Selecione "Copiar ID"

## ⚠️ Aviso Importante

- O servidor de destino terá todos os seus canais apagados antes da clonagem
- Nunca compartilhe seu token de utilizador
- Use esta ferramenta com responsabilidade
- Alguns elementos podem não ser clonados devido a limitações de permissões

## 🔒 Segurança

- Seu token é usado apenas localmente
- Nenhum dado é enviado para servidores externos
- O aplicativo usa apenas a API oficial do Discord

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
