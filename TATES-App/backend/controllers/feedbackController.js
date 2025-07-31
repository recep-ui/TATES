// feedbackController.js
const db = require('../config/db');

exports.sendFeedback = (req, res) => {
  const { feedback } = req.body;
  if (!feedback || !feedback.trim()) {
    return res.status(400).json({ message: 'Geri bildirim boş olamaz.' });
  }
  db.query(
    'INSERT INTO feedback (feedback, created_at) VALUES (?, NOW())',
    [feedback],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Veritabanı hatası' });
      res.json({ success: true, id: result.insertId });
    }
  );
};
