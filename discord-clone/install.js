const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('\n🚀 Instalador do Clonador de Servidor Discord\n');

// Função para executar comandos com tratamento de erro
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

// Verifica se o Node.js está instalado
console.log('📋 Verificando requisitos...');
try {
    const nodeVersion = execSync('node --version').toString().trim();
    console.log(`✅ Node.js ${nodeVersion} encontrado`);
} catch (error) {
    console.error('❌ Node.js não encontrado. Por favor, instale o Node.js primeiro.');
    process.exit(1);
}

// Verifica se o npm está instalado
try {
    const npmVersion = execSync('npm --version').toString().trim();
    console.log(`✅ npm ${npmVersion} encontrado`);
} catch (error) {
    console.error('❌ npm não encontrado. Por favor, instale o npm primeiro.');
    process.exit(1);
}

// Instala as dependências
console.log('\n📦 Instalando dependências...');
if (!executeCommand('npm install')) {
    console.error('❌ Falha ao instalar dependências.');
    process.exit(1);
}

// Verifica se as dependências do Electron foram instaladas corretamente
console.log('\n🔍 Verificando instalação do Electron...');
if (!fs.existsSync(path.join(__dirname, 'node_modules', 'electron'))) {
    console.log('⚠️ Electron não encontrado, tentando instalar novamente...');
    if (!executeCommand('npm install electron electron-builder --save-dev')) {
        console.error('❌ Falha ao instalar Electron.');
        process.exit(1);
    }
}

// Cria diretório de build se não existir
if (!fs.existsSync(path.join(__dirname, 'build'))) {
    fs.mkdirSync(path.join(__dirname, 'build'));
}

// Compila o aplicativo
console.log('\n🛠️ Compilando o aplicativo...');
if (!executeCommand('npm run build')) {
    console.error('❌ Falha ao compilar o aplicativo.');
    process.exit(1);
}

console.log('\n✨ Instalação concluída com sucesso!\n');
console.log('Para iniciar o aplicativo em modo de desenvolvimento:');
console.log('  npm run dev');
console.log('\nPara criar uma versão distribuível:');
console.log('  npm run build');
console.log('\nO instalador pode ser encontrado na pasta "dist".\n');
