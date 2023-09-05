const express = require('express')
const usersRouter = require('./users')
const friendsRouter = require('./friends')
const chatsRouter = require('./chats')
const messagesRouter = require('./messages')

const router = express.Router()

router.use('/users', usersRouter)

router.use('/friends', friendsRouter)

router.use('/chats', chatsRouter)

router.use('/messages', messagesRouter)

module.exports = router