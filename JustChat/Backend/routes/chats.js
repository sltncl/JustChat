const express = require('express')
const chatsController = require('../controllers/chats')

const router = express.Router()

router.post('/add', chatsController.createChat)

router.delete('/delete/:chatId', chatsController.deleteChat)

router.get('/list/:userId', chatsController.getUserChats)

module.exports = router