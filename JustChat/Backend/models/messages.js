const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model("Message", messageSchema)