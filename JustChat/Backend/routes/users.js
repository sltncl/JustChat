const express = require('express')
const usersController = require('../controllers/users')

const router = express.Router()

router.post('/addUser', usersController.addUser)

router.post('/login', usersController.loginUser)

router.get('/profile', usersController.getProfile);

router.get('/logout', usersController.logoutUser);

router.delete('/delete/:userId', usersController.deleteUser)

router.get('/:userId/search', usersController.getUser)

module.exports = router

