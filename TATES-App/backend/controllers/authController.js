const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Auth controller: login, register, forgot password
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Kullanıcıyı veritabanından bul
    const [users] = await db.promise().query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // JWT token oluştur
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ 
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username, fullName: user.fullName, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, password, email, fullName } = req.body;
    
    // Şifreyi hashle
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Kullanıcıyı veritabanına ekle
    const [result] = await db.promise().query(
      'INSERT INTO users (username, password, email, fullName) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, email, fullName]
    );
    
    res.status(201).json({ 
      message: 'User registered successfully',
      userId: result.insertId
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Email kontrolü (gerçek uygulamada email gönderme işlemi yapılır)
    const [users] = await db.promise().query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Profile functions
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [users] = await db.promise().query(
      'SELECT id, username, email, fullName, createdAt FROM users WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ user: users[0] });
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserRecipes = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [recipes] = await db.promise().query(
      'SELECT * FROM recipes WHERE userId = ? ORDER BY createdAt DESC',
      [userId]
    );
    
    res.json({ recipes });
  } catch (error) {
    console.error('Error getting user recipes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserLikes = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [likes] = await db.promise().query(
      `SELECT rl.*, r.*, u.username 
       FROM recipe_likes rl 
       JOIN recipes r ON rl.recipeId = r.id 
       JOIN users u ON r.userId = u.id 
       WHERE rl.userId = ? 
       ORDER BY rl.createdAt DESC`,
      [userId]
    );
    
    res.json({ likes });
  } catch (error) {
    console.error('Error getting user likes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserComments = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [comments] = await db.promise().query(
      `SELECT rc.*, r.title as recipeTitle 
       FROM recipe_comments rc 
       JOIN recipes r ON rc.recipeId = r.id 
       WHERE rc.userId = ? 
       ORDER BY rc.createdAt DESC`,
      [userId]
    );
    
    res.json({ comments });
  } catch (error) {
    console.error('Error getting user comments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserSaved = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [saved] = await db.promise().query(
      `SELECT rf.*, r.*, u.username 
       FROM recipe_favorites rf 
       JOIN recipes r ON rf.recipeId = r.id 
       JOIN users u ON r.userId = u.id 
       WHERE rf.userId = ? 
       ORDER BY rf.createdAt DESC`,
      [userId]
    );
    
    res.json({ saved });
  } catch (error) {
    console.error('Error getting user saved:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
