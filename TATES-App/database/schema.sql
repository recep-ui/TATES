-- SQL schema for TATES
-- Users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  fullName VARCHAR(100),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Recipes table
CREATE TABLE recipes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  ingredients JSON,
  steps JSON,
  imageUrl VARCHAR(500),
  userId INT NOT NULL,
  likes INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Recipe likes table
CREATE TABLE recipe_likes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  recipeId INT NOT NULL,
  userId INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (recipeId) REFERENCES recipes(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_like (recipeId, userId)
);

-- Recipe favorites table
CREATE TABLE recipe_favorites (
  id INT PRIMARY KEY AUTO_INCREMENT,
  recipeId INT NOT NULL,
  userId INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (recipeId) REFERENCES recipes(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_favorite (recipeId, userId)
);

-- Recipe comments table
CREATE TABLE recipe_comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  recipeId INT NOT NULL,
  userId INT NOT NULL,
  comment TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (recipeId) REFERENCES recipes(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX idx_recipes_userId ON recipes(userId);
CREATE INDEX idx_recipes_createdAt ON recipes(createdAt);
CREATE INDEX idx_recipes_likes ON recipes(likes);
CREATE INDEX idx_recipe_likes_recipeId ON recipe_likes(recipeId);
CREATE INDEX idx_recipe_likes_userId ON recipe_likes(userId);
CREATE INDEX idx_recipe_favorites_recipeId ON recipe_favorites(recipeId);
CREATE INDEX idx_recipe_favorites_userId ON recipe_favorites(userId);
CREATE INDEX idx_recipe_comments_recipeId ON recipe_comments(recipeId);
CREATE INDEX idx_recipe_comments_userId ON recipe_comments(userId);
