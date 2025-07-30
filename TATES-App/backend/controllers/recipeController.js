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
      'SELECT * FROM recipes ORDER BY createdAt DESC'
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
      'SELECT * FROM recipes WHERE id = ?',
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
