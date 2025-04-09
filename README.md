# Twitter Clone Simples (Node.js + Frontend Básico)

Este é um projeto simples que simula algumas funcionalidades básicas da rede social Twitter, como login/registro, postagem de tweets, feed de notícias, sistema de seguir e curtir.

## Funcionalidades

*   **Autenticação:** Tela simplificada de Login e Registro. (Segurança **não** é o foco aqui, senhas são salvas em texto plano no "banco de dados" em memória e o estado de login é mantido via `localStorage`).
*   **Postagem:** Usuários logados podem postar tweets (com limite de 280 caracteres).
*   **Feed de Notícias:** Exibe os tweets do próprio usuário e dos usuários que ele segue, ordenados do mais recente para o mais antigo.
*   **Seguir:** Usuários podem seguir outros usuários clicando em um botão no tweet deles.
*   **Curtir/Descurtir:** Usuários podem curtir e descurtir tweets no feed.
*   **Responsividade:** O layout se adapta a dois tamanhos de tela principais (desktop ~1920px e mobile ~430px).

## Tecnologias Utilizadas

*   **Backend:**
    *   Node.js
    *   Express.js (Framework web)
    *   Cors (Middleware para permissões de acesso entre domínios)
    *   Banco de Dados em Memória (simulado com arrays JavaScript em `backend/data/db.js`)
*   **Frontend:**
    *   HTML5
    *   CSS3 (com Flexbox/Grid básicos e Media Queries para responsividade)
    *   JavaScript (Vanilla JS)
    *   Fetch API (para comunicação com o backend)
    *   `localStorage` (para persistência *simplificada* do login no navegador)
*   **API:**
    *   RESTful (seguindo padrões REST)
    *   JSON (formato de troca de dados)

## Pré-requisitos

*   [Node.js](https://nodejs.org/) (versão 14 ou superior recomendada)
*   [npm](https://www.npmjs.com/) (geralmente vem junto com o Node.js)
*   Um navegador web moderno (Chrome, Firefox, Edge, etc.)

## Instalação

1.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO_GIT> twitter-clone
    # Ou baixe o ZIP e extraia os arquivos em uma pasta chamada twitter-clone
    ```

2.  **Navegue até a pasta do backend e instale as dependências:**
    ```bash
    cd twitter-clone/backend
    npm install
    ```
    *(Não há dependências para instalar no frontend neste exemplo)*

## Executando a Aplicação

1.  **Inicie o servidor backend:**
    *   Ainda dentro da pasta `backend`, execute:
        ```bash
        npm start
        ```
    *   Você deverá ver a mensagem `Servidor backend rodando na porta 3000` (ou outra porta, se configurado). O backend precisa estar rodando para o frontend funcionar.

2.  **Abra o frontend no navegador:**
    *   Navegue até a pasta `frontend` no seu explorador de arquivos.
    *   Abra o arquivo `login.html` diretamente no seu navegador web (clique duplo ou use a opção "Abrir com..." do seu navegador).
    *   **Alternativa:** Se você tiver uma extensão como "Live Server" no VS Code, pode usá-la para servir os arquivos do frontend, o que é geralmente melhor para desenvolvimento.

## Como Usar

1.  **Registro:** Na tela inicial (`login.html`), use o formulário de registro para criar um novo usuário (ex: `usuario: teste`, `senha: 123`).
2.  **Login:** Use o formulário de login com as credenciais que você acabou de criar.
3.  **Feed (`index.html`):** Após o login, você será redirecionado para o feed.
    *   **Postar:** Use a caixa de texto no topo para escrever e postar seus tweets.
    *   **Ver Feed:** Role a página para ver os tweets (seus e de quem você segue). Os usuários 'alice' e 'bob' são criados por padrão com alguns tweets de exemplo.
    *   **Curtir:** Clique no botão ❤️ Curtir abaixo de um tweet. O botão mudará para ❤️ Descurtir e a contagem será atualizada. Clique novamente para descurtir.
    *   **Seguir:** Clique no botão "Seguir @usuario" que aparece nos tweets de outros usuários. O feed será atualizado para incluir os tweets deles (pode levar um momento ou exigir recarga manual, dependendo da implementação exata).
4.  **Logout:** Clique no botão "Logout" no canto superior direito para sair e retornar à tela de login.

## Estrutura do Projeto