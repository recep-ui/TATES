const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/forgot-password', authController.forgotPassword);

// Profile routes (require authentication)
router.get('/profile', authMiddleware, authController.getProfile);
router.get('/profile/recipes', authMiddleware, authController.getUserRecipes);
router.get('/profile/likes', authMiddleware, authController.getUserLikes);
router.get('/profile/comments', authMiddleware, authController.getUserComments);
router.get('/profile/saved', authMiddleware, authController.getUserSaved);
router.get('/profile/favorites', authMiddleware, authController.getUserFavorites);

module.exports = router;
