const db = require('../config/db');

// Recipe controller: add, list, etc.
exports.addRecipe = async (req, res) => {
  try {
    const { title, description, ingredients, steps } = req.body;
    const userId = req.user.id; // JWT'den gelen kullanıcı ID'si
    
    // Image URL'ini al
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    
    const [result] = await db.promise().query(
      'INSERT INTO recipes (title, description, ingredients, steps, imageUrl, userId) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, JSON.stringify(ingredients), JSON.stringify(steps), imageUrl, userId]
    );
    
    res.status(201).json({ 
      message: 'Recipe added successfully',
      recipeId: result.insertId,
      imageUrl: imageUrl
    });
  } catch (error) {
    console.error('Error adding recipe:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRecipes = async (req, res) => {
  try {
    const [recipes] = await db.promise().query(
      'SELECT r.*, u.username, u.fullName FROM recipes r JOIN users u ON r.userId = u.id ORDER BY r.createdAt DESC'
    );
    
    res.json({ recipes });
  } catch (error) {
    console.error('Error getting recipes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [recipes] = await db.promise().query(
      'SELECT r.*, u.username, u.fullName FROM recipes r JOIN users u ON r.userId = u.id WHERE r.id = ?',
      [id]
    );
    
    if (recipes.length === 0) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    res.json({ recipe: recipes[0] });
  } catch (error) {
    console.error('Error getting recipe:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, ingredients, steps } = req.body;
    const userId = req.user.id;
    
    // Image URL'ini al
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl;
    
    const [result] = await db.promise().query(
      'UPDATE recipes SET title = ?, description = ?, ingredients = ?, steps = ?, imageUrl = ? WHERE id = ? AND userId = ?',
      [title, description, JSON.stringify(ingredients), JSON.stringify(steps), imageUrl, id, userId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Recipe not found or unauthorized' });
    }
    
    res.json({ message: 'Recipe updated successfully', imageUrl: imageUrl });
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const [result] = await db.promise().query(
      'DELETE FROM recipes WHERE id = ? AND userId = ?',
      [id, userId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Recipe not found or unauthorized' });
    }
    
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Like functionality
exports.likeRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Check if already liked
    const [existing] = await db.promise().query(
      'SELECT * FROM recipe_likes WHERE recipeId = ? AND userId = ?',
      [id, userId]
    );
    
    if (existing.length > 0) {
      // Unlike
      await db.promise().query(
        'DELETE FROM recipe_likes WHERE recipeId = ? AND userId = ?',
        [id, userId]
      );
      
      // Decrease like count
      await db.promise().query(
        'UPDATE recipes SET likes = likes - 1 WHERE id = ?',
        [id]
      );
      
      res.json({ message: 'Recipe unliked', liked: false });
    } else {
      // Like
      await db.promise().query(
        'INSERT INTO recipe_likes (recipeId, userId) VALUES (?, ?)',
        [id, userId]
      );
      
      // Increase like count
      await db.promise().query(
        'UPDATE recipes SET likes = likes + 1 WHERE id = ?',
        [id]
      );
      
      res.json({ message: 'Recipe liked', liked: true });
    }
  } catch (error) {
    console.error('Error liking recipe:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Favorite functionality
exports.favoriteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Check if already favorited
    const [existing] = await db.promise().query(
      'SELECT * FROM recipe_favorites WHERE recipeId = ? AND userId = ?',
      [id, userId]
    );
    
    if (existing.length > 0) {
      // Remove from favorites
      await db.promise().query(
        'DELETE FROM recipe_favorites WHERE recipeId = ? AND userId = ?',
        [id, userId]
      );
      
      res.json({ message: 'Recipe removed from favorites', favorited: false });
    } else {
      // Add to favorites
      await db.promise().query(
        'INSERT INTO recipe_favorites (recipeId, userId) VALUES (?, ?)',
        [id, userId]
      );
      
      res.json({ message: 'Recipe added to favorites', favorited: true });
    }
  } catch (error) {
    console.error('Error favoriting recipe:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Comments functionality
exports.getComments = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [comments] = await db.promise().query(
      'SELECT c.*, u.username FROM recipe_comments c JOIN users u ON c.userId = u.id WHERE c.recipeId = ? ORDER BY c.createdAt DESC',
      [id]
    );
    
    res.json({ comments });
  } catch (error) {
    console.error('Error getting comments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const userId = req.user.id;
    
    const [result] = await db.promise().query(
      'INSERT INTO recipe_comments (recipeId, userId, comment) VALUES (?, ?, ?)',
      [id, userId, comment]
    );
    
    res.status(201).json({ 
      message: 'Comment added successfully',
      commentId: result.insertId
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
