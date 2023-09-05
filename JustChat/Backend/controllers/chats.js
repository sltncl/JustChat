const User = require('../models/users');
const Chat = require('../models/chats');

module.exports = {

    createChat: (req, res) => {
        const username1 = req.body.username1;
        const username2 = req.body.username2;

        Promise.all([
            User.findOne({ username: username1 }),
            User.findOne({ username: username2 })
        ])
            .then(([user1, user2]) => {
                if (!user1 || !user2) {
                    res.json({ error: 'User not found' });
                } else {
                    Chat.findOne({ users: { $all: [user1._id, user2._id] } })
                        .populate('users', 'username')
                        .then(existingChat => {
                            if (existingChat) {
                                res.json({ error: 'Chat already exists' , chat:existingChat});
                            } else {
                                const newChat = new Chat({
                                    users:
                                        [{_id: user1._id, username: user1.username},
                                        {_id: user2._id, username: user2.username}],
                                    messages: []
                                });
                                newChat.save()
                                    .then(() => {
                                        Chat.findOne({_id: newChat._id})
                                            .populate('users', 'username')
                                            .then(chat=>res.json({chat: chat}))
                                    })
                                    .catch(error => res.json({ error: error.message }));
                            }
                        })
                        .catch(error => res.json({ error: error.message }));
                }
            })
            .catch(error => res.json({ error: error.message }));
    },

    deleteChat: (req, res) => {
        const chatId = req.params.chatId;

        Chat.findByIdAndDelete(chatId)
            .then(deletedChat => {
                if (deletedChat) {
                    res.json({ success: true, message: 'Chat deleted successfully' });
                } else {
                    res.json({ error: 'Chat not found' });
                }
            })
            .catch(error => res.json({ error: error.message }));
    },

    getUserChats: (req, res) => {
        const userId = req.params.userId;

        Chat.find({ users: userId })
            .populate('users', 'username')
            .populate({
                path: 'messages',
                populate: {
                    path: 'sender',
                    select: 'username'
                },
                options: {
                    sort: { timestamp: 1 } // Ordina i messaggi per timestamp in ordine crescente
                }
            })
            .then(chats => {
                if (chats.length === 0) {
                    return res.json({ message: 'Nessuna chat trovata per l\'utente' });
                }
                res.json({ chats });
            })
            .catch(error => res.json({ error: error.message }));
    },

};
