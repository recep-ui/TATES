const feedbackRoutes = require('./routes/feedback');
// Express server entry point
const express = require('express');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config({ path: __dirname + '/.env' });

const app = express();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipes');

const recentlyViewedRoutes = require('./routes/recentlyViewed');

app.use('/api', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/recently-viewed', recentlyViewedRoutes);
app.use('/api/feedback', feedbackRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
