const express = require('express');
const router = express.Router();
const {
  getStockMovements,
  getStockMovementReports
} = require('../controllers/stockMovementController');

router.get('/', getStockMovements);
router.get('/reports', getStockMovementReports);

module.exports = router;
