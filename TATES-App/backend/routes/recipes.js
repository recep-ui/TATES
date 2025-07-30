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

module.exports = router;
