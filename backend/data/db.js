// backend/data/db.js
let users = []; // Formato: { id, username, password, following: [userId], followers: [userId] }
let tweets = []; // Formato: { id, userId, username, content, timestamp, likes: [userId] }
let nextUserId = 1;
let nextTweetId = 1;

// Funções auxiliares para manipular os dados (simulando um DB)
const findUserByUsername = (username) => users.find(u => u.username === username);
const findUserById = (id) => users.find(u => u.id === id);
const findTweetById = (id) => tweets.find(t => t.id === id);

const addUser = (username, password) => {
    if (findUserByUsername(username)) {
        return null; // Usuário já existe
    }
    const newUser = {
        id: nextUserId++,
        username,
        password, // Em um app real, armazene HASH da senha!
        following: [],
        followers: []
    };
    users.push(newUser);
    return newUser;
};

const addTweet = (userId, content) => {
    const user = findUserById(userId);
    if (!user) return null;

    const newTweet = {
        id: nextTweetId++,
        userId,
        username: user.username,
        content,
        timestamp: new Date().toISOString(),
        likes: []
    };
    tweets.unshift(newTweet); // Adiciona no início para ordem cronológica inversa
    return newTweet;
};

const getFeedTweets = (userId) => {
    const user = findUserById(userId);
    if (!user) return [];

    const followedUserIds = user.following;
    // Inclui os tweets do próprio usuário e dos que ele segue
    const feedUserIds = [userId, ...followedUserIds];

    return tweets
        .filter(tweet => feedUserIds.includes(tweet.userId))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Ordena mais recentes primeiro
};

const followUser = (followerId, followingUsername) => {
    const follower = findUserById(followerId);
    const userToFollow = findUserByUsername(followingUsername);

    if (!follower || !userToFollow || follower.id === userToFollow.id) {
        return false; // Não pode seguir a si mesmo ou usuários inexistentes
    }

    // Adiciona na lista 'following' do seguidor
    if (!follower.following.includes(userToFollow.id)) {
        follower.following.push(userToFollow.id);
    }
    // Adiciona na lista 'followers' do seguido
    if (!userToFollow.followers.includes(follower.id)) {
        userToFollow.followers.push(follower.id);
    }
    return true;
};


const likeTweet = (userId, tweetId) => {
    const tweet = findTweetById(tweetId);
    const user = findUserById(userId);

    if (!tweet || !user) return false;

    if (!tweet.likes.includes(userId)) {
        tweet.likes.push(userId);
    }
    return true;
};

const unlikeTweet = (userId, tweetId) => {
    const tweet = findTweetById(tweetId);
    if (!tweet) return false;

    tweet.likes = tweet.likes.filter(id => id !== userId);
    return true;
};


module.exports = {
    users,
    tweets,
    findUserByUsername,
    findUserById,
    addUser,
    addTweet,
    getFeedTweets,
    followUser,
    likeTweet,
    unlikeTweet,
    findTweetById, // Exportar para uso na API se necessário
};