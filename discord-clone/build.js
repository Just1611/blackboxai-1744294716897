const builder = require('electron-builder');
const Platform = builder.Platform;
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando processo de build...\n');

// Verifica ambiente
const isDev = process.env.NODE_ENV === 'development';
console.log(`📋 Ambiente: ${isDev ? 'Desenvolvimento' : 'Produção'}`);

// Função para executar comandos
function executeCommand(command) {
    try {
        execSync(command, { stdio: 'inherit' });
        return true;
    } catch (error) {
        console.error(`❌ Erro ao executar comando: ${command}`);
        console.error(error.message);
        return false;
    }
}

// Limpa diretório dist
console.log('\n🧹 Limpando diretório dist...');
if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
}

// Instala dependências se necessário
if (!fs.existsSync('node_modules')) {
    console.log('\n📦 Instalando dependências...');
    if (!executeCommand('npm install')) {
        process.exit(1);
    }
}

// Configurações do build
const config = {
    appId: 'com.discordcloner.app',
    productName: 'Discord Server Cloner',
    copyright: `Copyright © ${new Date().getFullYear()}`,
    directories: {
        output: 'dist',
        buildResources: 'build'
    },
    files: [
        '**/*',
        '!**/node_modules/*/{CHANGELOG.md,README.md,README,readme.md,readme}',
        '!**/node_modules/*/{test,__tests__,tests,powered-test,example,examples}',
        '!**/node_modules/*.d.ts',
        '!**/node_modules/.bin',
        '!**/*.{iml,o,hprof,orig,pyc,pyo,rbc,swp,csproj,sln,xproj}',
        '!.editorconfig',
        '!**/._*',
        '!**/{.DS_Store,.git,.hg,.svn,CVS,RCS,SCCS,.gitignore,.gitattributes}',
        '!**/{__pycache__,thumbs.db,.flowconfig,.idea,.vs,.nyc_output}',
        '!**/{appveyor.yml,.travis.yml,circle.yml}',
        '!**/{npm-debug.log,yarn.lock,.yarn-integrity,.yarn-metadata.json}'
    ],
    win: {
        target: [
            {
                target: 'nsis',
                arch: ['x64']
            }
        ],
        icon: 'build/icon.ico'
    },
    nsis: {
        oneClick: false,
        allowToChangeInstallationDirectory: true,
        createDesktopShortcut: true,
        createStartMenuShortcut: true,
        shortcutName: 'Discord Server Cloner',
        installerLanguages: ['pt-PT'],
        language: '1046'
    },
    mac: {
        target: 'dmg',
        icon: 'build/icon.icns',
        category: 'public.app-category.utilities'
    },
    linux: {
        target: ['AppImage', 'deb'],
        icon: 'build/icon.png',
        category: 'Utility',
        desktop: {
            Name: 'Discord Server Cloner',
            Comment: 'Clone servidores do Discord facilmente',
            Categories: 'Utility;Network;'
        }
    },
    protocols: {
        name: 'Discord Server Cloner Protocol',
        schemes: ['discord-cloner']
    },
    publish: null
};

// Função principal de build
async function buildApp() {
    try {
        console.log('\n🛠️ Iniciando build...');

        // Determina as plataformas baseado no sistema operacional
        let platforms = [];
        switch (process.platform) {
            case 'win32':
                platforms.push(Platform.WINDOWS);
                break;
            case 'darwin':
                platforms.push(Platform.MAC);
                break;
            case 'linux':
                platforms.push(Platform.LINUX);
                break;
            default:
                platforms = [Platform.WINDOWS, Platform.MAC, Platform.LINUX];
        }

        // Executa o build
        await builder.build({
            targets: platforms.map(p => p.createTarget()),
            config: config
        });

        console.log('\n✅ Build concluído com sucesso!');
        console.log('\nArquivos gerados:');
        const distPath = path.join(__dirname, 'dist');
        fs.readdirSync(distPath).forEach(file => {
            console.log(`  - ${file}`);
        });

    } catch (error) {
        console.error('\n❌ Erro durante o build:');
        console.error(error);
        process.exit(1);
    }
}

// Executa o build
buildApp();
