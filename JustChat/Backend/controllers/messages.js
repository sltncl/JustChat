const User = require('../models/users');
const Chat = require('../models/chats');
const Message = require('../models/messages');


module.exports = {
    createMessage: (req, res) => {
        const chatId = req.body.chatId;
        const senderId = req.body.senderId;
        const content = req.body.content;

        Promise.all([
            Chat.findById(chatId),
            User.findById(senderId)
        ])
            .then(([chat, sender]) => {
                if (!chat || !sender) {
                    res.json({ error: 'Chat or sender not found' });
                } else {
                    const newMessage = new Message({
                        chatId: chat._id,
                        sender: sender._id,
                        content: content
                    });

                    newMessage.save()
                        .then(() => {
                            chat.messages.push(newMessage._id);
                            chat.save()
                                .then(() => {
                                    res.json({ success: true, message: newMessage });
                                })
                                .catch(error => res.json({ error: error.message }));
                        })
                        .catch(error => res.json({ error: error.message }));
                }
            })
            .catch(error => res.json({ error: error.message }));
    },

    getMessagesWithUser: (req, res) => {
        const chatId = req.params.chatId; // ID della chat

        Chat.findOne({ _id: chatId })
            .populate('messages')
            .then(chat => {
                if (!chat) {
                    return res.json({ message: 'Nessuna chat trovata' });
                }
                res.json({ messages: chat.messages });
            })
            .catch(error => res.json({ error: error.message }));
    }
};
