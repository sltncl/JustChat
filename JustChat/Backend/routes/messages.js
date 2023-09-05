const express = require('express')
const messagesController = require('../controllers/messages')

const router = express.Router()

router.post('/add', messagesController.createMessage)

router.get('/:chatId', messagesController.getMessagesWithUser)

module.exports = router