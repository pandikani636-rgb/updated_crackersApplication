
const express = require('express');
const router = express.Router();
const {
  getPackingOrders,
  getPackingOrderById,
  createPackingOrder,
  updatePackingOrder,
  deletePackingOrder
} = require('../controllers/packingOrderController');

router.route('/').get(getPackingOrders).post(createPackingOrder);
router.route('/:id').get(getPackingOrderById).put(updatePackingOrder).delete(deletePackingOrder);

module.exports = router;
