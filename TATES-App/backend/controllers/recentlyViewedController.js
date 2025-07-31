// recentlyViewedController.js
const db = require('../config/db');

// Son görüntülenenleri getir
exports.getRecentlyViewed = (req, res) => {
  // Örnek: userId ile filtrelenebilir
  const userId = req.query.userId || 1;
  db.query(
    'SELECT id, title, viewed_at FROM recently_viewed WHERE user_id = ? ORDER BY viewed_at DESC LIMIT 20',
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Veritabanı hatası' });
      res.json(results);
    }
  );
};

// Yeni bir görüntüleme kaydı ekle
exports.addRecentlyViewed = (req, res) => {
  const { userId, recipeId } = req.body;
  if (!userId || !recipeId) return res.status(400).json({ message: 'Eksik bilgi' });
  db.query(
    'INSERT INTO recently_viewed (user_id, recipe_id, viewed_at) VALUES (?, ?, NOW())',
    [userId, recipeId],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Veritabanı hatası' });
      res.json({ success: true, id: result.insertId });
    }
  );
};
