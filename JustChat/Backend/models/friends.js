const mongoose = require('mongoose')

const friendshipSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    sentRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    receivedRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
})

module.exports = mongoose.model("Friendship", friendshipSchema)