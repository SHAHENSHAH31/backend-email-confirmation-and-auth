const express = require('express');
const router = express.Router();
const {signup,confirmEmail,getProfile,login} = require('../controllers/authController');
const {authMiddleware} = require('../middleware/auth');

router.post('/signup', signup);
 router.post('/login', login);
 router.get('/profile', authMiddleware, getProfile);
router.get('/confirm-email/:token', confirmEmail);

module.exports = router;