const express = require('express')
const friendsController = require('../controllers/friends')

const router = express.Router()

router.post('/addFriend', friendsController.addFriend)

router.delete('/removeFriend/:username/:friendUsername', friendsController.removeFriend)

router.post('/accept', friendsController.acceptFriendRequest)

router.post('/reject', friendsController.rejectFriendRequest)

router.get('/list/:userId', friendsController.getFriendsList)

router.get('/sentRequests/:userId', friendsController.getSentRequests)

router.get('/receivedRequests/:userId', friendsController.getReceivedRequests)

module.exports = router