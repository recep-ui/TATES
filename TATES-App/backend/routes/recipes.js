const express = require('express');
const router = express.Router();
const multer = require('multer');
const recipeController = require('../controllers/recipeController');
const authMiddleware = require('../middleware/authMiddleware');

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Public routes
router.get('/', recipeController.getRecipes);
router.get('/:id', recipeController.getRecipeById);

// Protected routes (require authentication)
router.post('/', authMiddleware, upload.single('image'), recipeController.addRecipe);
router.put('/:id', authMiddleware, upload.single('image'), recipeController.updateRecipe);
router.delete('/:id', authMiddleware, recipeController.deleteRecipe);

// Like and favorite routes
router.post('/:id/like', authMiddleware, recipeController.likeRecipe);
router.post('/:id/favorite', authMiddleware, recipeController.favoriteRecipe);

// Comments routes
router.get('/:id/comments', recipeController.getComments);
router.post('/:id/comments', authMiddleware, recipeController.addComment);

// Trending routes
router.get('/trending', recipeController.getTrendingRecipes);

module.exports = router;
