const express = require('express');
const router = express.Router();
const {
  getSales,
  finalizeSale,
  cancelSale,
  getSaleReports,
  createSale,
  updateSale,
  deleteSale
} = require('../controllers/saleController');

router.get('/reports', getSaleReports);
router.post('/finalize', finalizeSale);
router.post('/:id/cancel', cancelSale);

router.route('/').get(getSales).post(createSale);
router.route('/:id').put(updateSale).delete(deleteSale);

module.exports = router;
