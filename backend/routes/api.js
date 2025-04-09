// backend/routes/api.js
const express = require('express');
const db = require('../data/db');
const router = express.Router();

// --- Autenticação ---

// Registro Simplificado
router.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Usuário e senha são obrigatórios.' });
    }
    const newUser = db.addUser(username, password);
    if (!newUser) {
        return res.status(409).json({ success: false, message: 'Nome de usuário já existe.' });
    }
    res.status(201).json({ success: true, message: 'Usuário registrado com sucesso!', userId: newUser.id, username: newUser.username });
});

// Login Simplificado
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Usuário e senha são obrigatórios.' });
    }
    const user = db.findUserByUsername(username);
    // ATENÇÃO: Comparação de senha insegura! Apenas para simulação.
    if (!user || user.password !== password) {
        return res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
    }
    res.json({ success: true, message: 'Login bem-sucedido!', userId: user.id, username: user.username });
});

// --- Tweets ---

// Postar Tweet
router.post('/tweets', (req, res) => {
    const { userId, content } = req.body; // Frontend precisa enviar o userId após login
    if (!userId || !content) {
        return res.status(400).json({ success: false, message: 'ID do usuário e conteúdo são obrigatórios.' });
    }
    if (content.length > 280) {
         return res.status(400).json({ success: false, message: 'Tweet excede 280 caracteres.' });
    }
    const user = db.findUserById(parseInt(userId)); // Garante que userId seja número
    if (!user) {
        return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
    }

    const newTweet = db.addTweet(user.id, content);
    if (!newTweet) {
        return res.status(500).json({ success: false, message: 'Erro ao postar tweet.' });
    }
    res.status(201).json({ success: true, tweet: newTweet });
});

// Obter Feed de Notícias (Tweets de seguidos + próprios)
router.get('/feed/:userId', (req, res) => {
    const userId = parseInt(req.params.userId); // Garante que userId seja número
    if (isNaN(userId)) {
         return res.status(400).json({ success: false, message: 'ID do usuário inválido.' });
    }
    const user = db.findUserById(userId);
    if (!user) {
        return res.status(404).json({ success: false, message: 'Usuário não encontrado para buscar o feed.' });
    }
    const feedTweets = db.getFeedTweets(userId);
    res.json({ success: true, tweets: feedTweets });
});


// --- Seguidores ---

router.post('/users/follow', (req, res) => {
    const { followerId, userToFollowUsername } = req.body; // followerId é quem está logado
     if (!followerId || !userToFollowUsername) {
        return res.status(400).json({ success: false, message: 'IDs do seguidor e nome do usuário a seguir são obrigatórios.' });
    }
    const success = db.followUser(parseInt(followerId), userToFollowUsername);
    if (success) {
        res.json({ success: true, message: `Agora você segue ${userToFollowUsername}` });
    } else {
        res.status(400).json({ success: false, message: 'Não foi possível seguir o usuário (verifique se existe ou se já segue).' });
    }
});

// --- Curtidas ---

router.post('/tweets/:tweetId/like', (req, res) => {
    const tweetId = parseInt(req.params.tweetId);
    const { userId } = req.body; // Quem está curtindo
     if (isNaN(tweetId) || !userId) {
        return res.status(400).json({ success: false, message: 'ID do tweet e ID do usuário são obrigatórios.' });
    }
    const success = db.likeTweet(parseInt(userId), tweetId);
    if (success) {
        // Opcional: retornar o tweet atualizado com a nova contagem de likes
        const updatedTweet = db.findTweetById(tweetId);
        res.json({ success: true, message: 'Tweet curtido!', likes: updatedTweet.likes.length });
    } else {
        res.status(400).json({ success: false, message: 'Não foi possível curtir o tweet (verifique IDs).' });
    }
});

router.post('/tweets/:tweetId/unlike', (req, res) => {
    const tweetId = parseInt(req.params.tweetId);
    const { userId } = req.body; // Quem está descurtindo
    if (isNaN(tweetId) || !userId) {
        return res.status(400).json({ success: false, message: 'ID do tweet e ID do usuário são obrigatórios.' });
    }
    const success = db.unlikeTweet(parseInt(userId), tweetId);
     if (success) {
        // Opcional: retornar o tweet atualizado
        const updatedTweet = db.findTweetById(tweetId);
        res.json({ success: true, message: 'Tweet descurtido!', likes: updatedTweet.likes.length });
    } else {
        res.status(400).json({ success: false, message: 'Não foi possível descurtir o tweet.' });
    }
});


module.exports = router;