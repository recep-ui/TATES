const db = require('../config/db');

exports.getCategories = async (req, res) => {
  try {
    const [categories] = await db.promise().query(
      'SELECT * FROM categories ORDER BY name ASC'
    );
    
    res.json({ categories });
  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [categories] = await db.promise().query(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );
    
    if (categories.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json({ category: categories[0] });
  } catch (error) {
    console.error('Error getting category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPopularCategories = async (req, res) => {
  try {
    const [categories] = await db.promise().query(`
      SELECT c.*, COUNT(r.id) as recipeCount
      FROM categories c
      LEFT JOIN recipes r ON c.id = r.categoryId
      GROUP BY c.id
      ORDER BY recipeCount DESC
      LIMIT 8
    `);
    
    // Trend yönünü belirle (basit hesaplama)
    const popularCategories = categories.map((category, index) => ({
      ...category,
      trend: index < 3 ? 'up' : index < 5 ? 'stable' : 'down'
    }));
    
    res.json({ categories: popularCategories });
  } catch (error) {
    console.error('Error getting popular categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 