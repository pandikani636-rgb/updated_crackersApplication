const express = require('express');
const router = express.Router();
const {
  getStocks,
  getStockById,
  createStock,
  updateStock,
  deleteStock,
  getAvailableInventory,
  getStockReports
} = require('../controllers/stockController');

router.get('/available-inventory', getAvailableInventory);
router.get('/reports', getStockReports);

router.route('/').get(getStocks).post(createStock);
router.route('/:id').get(getStockById).put(updateStock).delete(deleteStock);

module.exports = router;
