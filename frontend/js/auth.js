// frontend/js/auth.js
const API_URL = 'http://localhost:3000/api'; // URL base do seu backend

const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const registerMessage = document.getElementById('register-message');
const loginMessage = document.getElementById('login-message');

// --- Registro ---
registerForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o recarregamento da página

    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    registerMessage.textContent = ''; // Limpa mensagens anteriores

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
            registerMessage.textContent = 'Registro bem-sucedido! Faça o login.';
            registerMessage.className = 'message success';
            registerForm.reset(); // Limpa o formulário
        } else {
            registerMessage.textContent = data.message || 'Erro ao registrar.';
            registerMessage.className = 'message error';
        }
    } catch (error) {
        console.error('Erro na requisição de registro:', error);
        registerMessage.textContent = 'Erro de conexão com o servidor.';
        registerMessage.className = 'message error';
    }
});

// --- Login ---
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    loginMessage.textContent = '';

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // Armazena informações do usuário no localStorage (SIMPLIFICADO)
            // Em um app real, use tokens JWT ou sessões!
            localStorage.setItem('twitterCloneUser', JSON.stringify({
                userId: data.userId,
                username: data.username
            }));

            // Redireciona para a página principal (feed)
            window.location.href = 'index.html';

        } else {
            loginMessage.textContent = data.message || 'Erro ao fazer login.';
            loginMessage.className = 'message error';
        }
    } catch (error) {
        console.error('Erro na requisição de login:', error);
        loginMessage.textContent = 'Erro de conexão com o servidor.';
        loginMessage.className = 'message error';
    }
});

// --- Verificação inicial ---
// Se o usuário já estiver logado (tiver dados no localStorage), redireciona para o feed
if (localStorage.getItem('twitterCloneUser')) {
     console.log("Usuário já logado, redirecionando para index.html");
    //window.location.href = 'index.html'; // Descomente se quiser redirecionamento automático ao visitar login.html logado
}