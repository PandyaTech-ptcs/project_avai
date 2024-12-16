const express = require('express');
const router = express.Router();
const authenticateToken = require('../helpers/authenticateToken');
const { getUserProfile } = require('../controller/userController');
// const userController = require('../controllers/userController');
router.get('/profile', authenticateToken, getUserProfile);

module.exports = router;
