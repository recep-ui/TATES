const express = require('express');
const router = express.Router();
const recentlyViewedController = require('../controllers/recentlyViewedController');

// Son görüntülenenleri getir
router.get('/', recentlyViewedController.getRecentlyViewed);
// Yeni bir görüntüleme kaydı ekle
router.post('/', recentlyViewedController.addRecentlyViewed);

module.exports = router;
