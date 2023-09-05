const socketIO = require('socket.io');

const initSocketServer = (server) => {
    const io = socketIO(server, {
        cors: {
            origin: true,
            credentials: true
        }
    });

    let users = []
    const addUser = (userId, socketId) => {
        !users.some(user =>  user.userId === userId) && users.push({userId, socketId})
    }

    const removeUser = (socketId) => {
        users = users.filter(user => user.socketId !== socketId)
    }

    const getUser = (userId) => {
        return users.find(user => user.userId === userId)
    }

    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        // Connessione utente
        socket.on('userConnected', (userId) => {
            addUser(userId, socket.id)
            io.emit("getUsers", users)
        })

        // Creazione nuova chat
        socket.on('newChat', ({receiverId}) => {
            const user = getUser(receiverId)
            if (user) {
                io.to(user.socketId).emit('chatCreated')
            }
        });

        // Invio e ricezione messaggi
        // Riceve
        socket.on('newMessage', ({receiverId, chatId, text}) => {
            const user = getUser(receiverId)
            if (user) {
                io.to(user.socketId).emit('messageReceived', {chatId, text})
            }
        });

        // Invio e ricezione richieste di amicizia
        socket.on('newFriendRequest', ({senderId, receiverId}) => {
            const user = getUser(receiverId)
            if (user) {
                io.to(user.socketId).emit('requestReceived', senderId)
            }
        });

        // Utente accetta richiesta di amicizia
        socket.on('acceptRequest', ({sender, receiverId}) => {
            const user = getUser(receiverId)
            if (user) {
                io.to(user.socketId).emit('requestAccepted', sender)
            }
        })

        // Utente rifiuta richiesta di amicizia
        socket.on('rejectRequest', ({sender, receiverId}) => {
            const user = getUser(receiverId)
            if (user) {
                io.to(user.socketId).emit('requestRejected', sender)
            }
        })

        // Rimozione chat
        socket.on('deleteChat', (chatId) => {
            io.emit('chatDeleted', chatId)
        })
        // Disconnessione utente
        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
            removeUser(socket.id)
            io.emit("getUsers", users)
        });

        socket.on('logout', () => {
            console.log('Logout effettuato')
            removeUser(socket.id)
            io.emit("getUsers", users)
        })
    });
};

module.exports = initSocketServer;
