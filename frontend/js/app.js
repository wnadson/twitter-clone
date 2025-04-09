// frontend/js/app.js
const API_URL = 'http://localhost:3000/api'; // URL base do seu backend

const feedDiv = document.getElementById('feed');
const tweetForm = document.getElementById('tweet-form');
const tweetContent = document.getElementById('tweet-content');
const charCount = document.getElementById('char-count');
const tweetMessage = document.getElementById('tweet-message');
const welcomeUserSpan = document.getElementById('welcome-user');
const logoutButton = document.getElementById('logout-button');

let currentUser = null; // Armazena { userId, username }

// --- Funções Auxiliares ---

// Formata a data para exibição amigável
function formatTimeAgo(isoTimestamp) {
    const now = new Date();
    const past = new Date(isoTimestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInDays < 7) return `${diffInDays}d`;
    return past.toLocaleDateString(); // Mais antigo, mostra data
}

// Cria o HTML para um único tweet
function createTweetElement(tweet) {
    const tweetDiv = document.createElement('div');
    tweetDiv.classList.add('tweet');
    tweetDiv.dataset.tweetId = tweet.id; // Armazena o ID do tweet no elemento

    const isLiked = tweet.likes.includes(currentUser.userId);
    const likeButtonClass = isLiked ? 'liked' : '';
    const likeButtonText = isLiked ? 'Descurtir' : 'Curtir';

    // Botão Seguir (só mostra se o tweet NÃO for do usuário logado)
    let followButtonHtml = '';
    if (tweet.userId !== currentUser.userId) {
        // A lógica para saber se já segue precisaria de mais dados do backend
        // ou uma chamada extra. Simplificado: sempre mostra "Seguir".
         followButtonHtml = `<button class="follow-button" data-username-to-follow="${tweet.username}">Seguir @${tweet.username}</button>`;
    }


    tweetDiv.innerHTML = `
        <div class="tweet-header">
             <div>
                <span class="tweet-user">${tweet.username}</span>
                <span class="tweet-time"> - ${formatTimeAgo(tweet.timestamp)}</span>
            </div>
            ${followButtonHtml}
        </div>
        <div class="tweet-content">${escapeHTML(tweet.content)}</div>
        <div class="tweet-actions">
            <button class="like-button ${likeButtonClass}" data-tweet-id="${tweet.id}">
                ❤️ ${likeButtonText}
            </button>
            <span class="like-count">${tweet.likes.length}</span>
            <!-- Outras ações como comentar, retweetar podem ser adicionadas aqui -->
        </div>
    `;

     // Adiciona event listener para o botão de curtir/descurtir DESTE tweet
    const likeButton = tweetDiv.querySelector('.like-button');
    if (likeButton) {
        likeButton.addEventListener('click', handleLikeToggle);
    }

    // Adiciona event listener para o botão de seguir DESTE tweet
    const followButton = tweetDiv.querySelector('.follow-button');
    if (followButton) {
        followButton.addEventListener('click', handleFollow);
    }


    return tweetDiv;
}

// Função para escapar caracteres HTML especiais e prevenir XSS básico
function escapeHTML(str) {
    // Garante que estamos lidando com uma string
    str = String(str);
    // Mapa de caracteres a serem substituídos por suas entidades HTML CORRETAS
    const escapeMap = {
        '&': '&',  // <-- CORRETO
        '<': '<',   // <-- CORRETO
        '>': '>',   // <-- CORRETO
        '"': '"', // <-- CORRETO
        
    };
    // Usa replace com uma expressão regular para encontrar todos os caracteres
    // que precisam ser escapados e os substitui usando o mapa
    return str.replace(/[&<>"']/g, function(match) {
        return escapeMap[match];
    });
}


// Carrega e exibe os tweets no feed
async function loadFeed() {
    if (!currentUser) return; // Precisa estar logado

    feedDiv.innerHTML = '<p>Carregando tweets...</p>'; // Mostra feedback

    try {
        const response = await fetch(`${API_URL}/feed/${currentUser.userId}`);
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        const data = await response.json();

        if (data.success && data.tweets) {
            feedDiv.innerHTML = ''; // Limpa o 'Carregando...'
            if (data.tweets.length === 0) {
                feedDiv.innerHTML = '<p>Seu feed está vazio. Siga alguém ou poste um tweet!</p>';
            } else {
                data.tweets.forEach(tweet => {
                    const tweetElement = createTweetElement(tweet);
                    feedDiv.appendChild(tweetElement);
                });
            }
        } else {
            feedDiv.innerHTML = `<p>Erro ao carregar feed: ${data.message || 'Erro desconhecido'}</p>`;
        }
    } catch (error) {
        console.error('Erro ao buscar feed:', error);
        feedDiv.innerHTML = '<p>Não foi possível conectar ao servidor para carregar o feed.</p>';
    }
}

// --- Manipuladores de Eventos ---

// Contagem de caracteres no textarea
tweetContent.addEventListener('input', () => {
    const count = tweetContent.value.length;
    charCount.textContent = `${count}/280`;
});

// Envio do formulário de novo tweet
tweetForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const content = tweetContent.value.trim();
    tweetMessage.textContent = '';

    if (!content) {
        tweetMessage.textContent = 'O tweet não pode estar vazio.';
        tweetMessage.className = 'message error';
        return;
    }
     if (content.length > 280) {
        tweetMessage.textContent = 'O tweet excede 280 caracteres.';
         tweetMessage.className = 'message error';
        return;
    }

    if (!currentUser) {
         tweetMessage.textContent = 'Erro: Usuário não logado.';
         tweetMessage.className = 'message error';
        return;
    }


    try {
        const response = await fetch(`${API_URL}/tweets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUser.userId, content: content })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            tweetMessage.textContent = 'Tweet postado!';
            tweetMessage.className = 'message success';
            tweetForm.reset(); // Limpa o formulário
            charCount.textContent = '0/280'; // Reseta contador
            loadFeed(); // Recarrega o feed para mostrar o novo tweet
             setTimeout(() => { tweetMessage.textContent = ''; }, 3000); // Limpa msg após 3s
        } else {
            tweetMessage.textContent = `Erro ao postar: ${data.message || 'Erro desconhecido'}`;
            tweetMessage.className = 'message error';
        }

    } catch (error) {
         console.error('Erro ao postar tweet:', error);
         tweetMessage.textContent = 'Erro de conexão ao postar tweet.';
         tweetMessage.className = 'message error';
    }
});

// Lidar com clique no botão Curtir/Descurtir
async function handleLikeToggle(event) {
    const button = event.currentTarget;
    const tweetId = button.dataset.tweetId;
    const isLiked = button.classList.contains('liked');
    const action = isLiked ? 'unlike' : 'like'; // Define a ação (curtir ou descurtir)
    const apiUrl = `${API_URL}/tweets/${tweetId}/${action}`;

    if (!currentUser) return; // Precisa estar logado

    // Atualiza a UI imediatamente para feedback rápido (otimista)
    const tweetElement = button.closest('.tweet');
    const likeCountSpan = tweetElement.querySelector('.like-count');
    let currentLikes = parseInt(likeCountSpan.textContent);

    if (isLiked) {
        button.classList.remove('liked');
        button.innerHTML = '❤️ Curtir';
        likeCountSpan.textContent = Math.max(0, currentLikes - 1); // Decrementa
    } else {
        button.classList.add('liked');
        button.innerHTML = '❤️ Descurtir';
        likeCountSpan.textContent = currentLikes + 1; // Incrementa
    }


    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUser.userId })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
             console.error(`Erro ao ${action} tweet:`, data.message);
            // Reverte a UI se a API falhar
             if (isLiked) {
                button.classList.add('liked');
                button.innerHTML = '❤️ Descurtir';
                likeCountSpan.textContent = currentLikes; // Volta ao original
            } else {
                button.classList.remove('liked');
                 button.innerHTML = '❤️ Curtir';
                likeCountSpan.textContent = currentLikes; // Volta ao original
            }
            alert(`Erro ao ${action}r o tweet.`);
        } else {
             // Atualiza a contagem de likes com o valor real retornado pela API (opcional, mas bom)
            if (data.likes !== undefined) {
                likeCountSpan.textContent = data.likes;
            }
             console.log(`Tweet ${tweetId} ${action}d com sucesso`);
        }

    } catch (error) {
        console.error(`Erro de rede ao ${action} tweet:`, error);
        // Reverte a UI em caso de erro de rede
        if (isLiked) {
             button.classList.add('liked');
             button.innerHTML = '❤️ Descurtir';
             likeCountSpan.textContent = currentLikes; // Volta ao original
        } else {
            button.classList.remove('liked');
            button.innerHTML = '❤️ Curtir';
             likeCountSpan.textContent = currentLikes; // Volta ao original
        }
        alert(`Erro de conexão ao tentar ${action}r o tweet.`);
    }
}

// Lidar com clique no botão Seguir
async function handleFollow(event) {
    const button = event.currentTarget;
    const userToFollowUsername = button.dataset.usernameToFollow;

    if (!currentUser || currentUser.username === userToFollowUsername) return; // Não seguir a si mesmo

     // Desabilita o botão para evitar cliques múltiplos
    button.disabled = true;
    button.textContent = 'Seguindo...';


    try {
         const response = await fetch(`${API_URL}/users/follow`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                followerId: currentUser.userId,
                userToFollowUsername: userToFollowUsername
            })
        });
        const data = await response.json();

        if (response.ok && data.success) {
            alert(data.message || `Você agora segue @${userToFollowUsername}`);
            button.textContent = 'Seguindo'; // Muda o estado visual
            // Idealmente, o botão deveria sumir ou mudar para "Deixar de Seguir"
            // e o feed deveria ser recarregado para incluir tweets do novo seguido.
            // Para simplificar, apenas mudamos o texto e desabilitamos.
             loadFeed(); // Recarrega o feed
        } else {
            alert(`Erro ao seguir: ${data.message || 'Erro desconhecido'}`);
            button.textContent = `Seguir @${userToFollowUsername}`; // Volta ao estado original
            button.disabled = false; // Reabilita
        }
    } catch (error) {
        console.error('Erro de rede ao seguir usuário:', error);
        alert('Erro de conexão ao tentar seguir o usuário.');
         button.textContent = `Seguir @${userToFollowUsername}`; // Volta ao estado original
         button.disabled = false; // Reabilita
    }

}


// Logout
logoutButton.addEventListener('click', () => {
    localStorage.removeItem('twitterCloneUser'); // Remove os dados do usuário
    window.location.href = 'login.html'; // Redireciona para login
});

// --- Inicialização ---
function initialize() {
    // 1. Verifica se o usuário está logado (busca dados no localStorage)
    const userData = localStorage.getItem('twitterCloneUser');

    if (!userData) {
        // Se não estiver logado, redireciona para a página de login
        window.location.href = 'login.html';
        return; // Interrompe a execução do resto do script
    }

    try {
        currentUser = JSON.parse(userData); // Guarda os dados do usuário logado
        if (!currentUser || !currentUser.userId || !currentUser.username) {
             // Dados inválidos, força logout
            localStorage.removeItem('twitterCloneUser');
            window.location.href = 'login.html';
            return;
        }
    } catch (e) {
         // Erro ao parsear JSON, força logout
         console.error("Erro ao ler dados do usuário do localStorage", e);
         localStorage.removeItem('twitterCloneUser');
         window.location.href = 'login.html';
         return;
    }


    // 2. Exibe mensagem de boas-vindas
    welcomeUserSpan.textContent = `Bem-vindo, ${currentUser.username}!`;

    // 3. Carrega o feed inicial
    loadFeed();
}

// Chama a função de inicialização quando a página carregar
initialize();