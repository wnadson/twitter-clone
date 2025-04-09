// backend/server.js
console.log("--- Iniciando server.js ---"); // <--- ADICIONE AQUI

const express = require('express');
console.log("--- Express importado ---"); // <--- ADICIONE AQUI

const cors = require('cors');
console.log("--- Cors importado ---"); // <--- ADICIONE AQUI

const apiRoutes = require('./routes/api');
console.log("--- Rotas API importadas ---"); // <--- ADICIONE AQUI

const db = require('./data/db'); // Importa db para inicializar dados
console.log("--- Banco de dados (db.js) importado ---"); // <--- ADICIONE AQUI


const app = express();
console.log("--- App Express criada ---"); // <--- ADICIONE AQUI

const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
console.log("--- Middleware CORS aplicado ---"); // <--- ADICIONE AQUI

app.use(express.json());
console.log("--- Middleware JSON aplicado ---"); // <--- ADICIONE AQUI

// Rotas da API
app.use('/api', apiRoutes);
console.log("--- Rotas da API aplicadas ---"); // <--- ADICIONE AQUI

// Rota de Teste
app.get('/', (req, res) => {
    console.log("--- Rota '/' acessada ---"); // <--- ADICIONE AQUI (dentro da rota)
    res.send('API do Twitter Clone está funcionando!');
});

// Iniciar o servidor
console.log(`--- Tentando iniciar o servidor na porta ${PORT}... ---`); // <--- ADICIONE AQUI

app.listen(PORT, () => {
    // ESTA MENSAGEM SÓ APARECE SE O SERVIDOR INICIAR COM SUCESSO
    console.log(`====== SERVIDOR RODANDO NA PORTA ${PORT} ======`);
    console.log('Dados iniciais (em memória):');
    // Adicionar alguns dados iniciais para teste (movido para dentro do listen para garantir que db foi carregado)
    if (db && db.users && db.users.length === 0) {
        console.log("--- Adicionando dados de teste ---");
        const user1 = db.addUser('alice', '123');
        const user2 = db.addUser('bob', '456');
        if(user1 && user2) {
            db.addTweet(user1.id, 'Olá mundo! Este é meu primeiro tweet.');
            db.addTweet(user2.id, 'Explorando esta nova plataforma!');
            db.addTweet(user1.id, 'Adoro programar em Node.js!');
            db.followUser(user1.id, 'bob'); // Alice segue Bob
            console.log('- Usuários e tweets de teste criados.');
        } else {
             console.log('- Erro ao criar usuários de teste.');
        }
    } else if (db && db.users) {
         console.log('- Dados já existentes ou erro ao acessar db.users.');
    } else {
        console.log('- Módulo db não carregado corretamente.');
    }
});

// Linha final para garantir que o script chegou até aqu
// i
console.log("--- Fim do script server.js (antes do listen callback) ---"); // <--- ADICIONE AQUI