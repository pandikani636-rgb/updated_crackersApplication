
const express = require('express');
const router = express.Router();
const {
  getProductionOrders,
  getProductionOrderById,
  createProductionOrder,
  updateProductionOrder,
  deleteProductionOrder
} = require('../controllers/productionOrderController');

router.route('/').get(getProductionOrders).post(createProductionOrder);
router.route('/:id').get(getProductionOrderById).put(updateProductionOrder).delete(deleteProductionOrder);

module.exports = router;
