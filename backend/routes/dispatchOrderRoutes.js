
const express = require('express');
const router = express.Router();
const {
  getDispatchOrders,
  getDispatchOrderById,
  createDispatchOrder,
  updateDispatchOrder,
  deleteDispatchOrder
} = require('../controllers/dispatchOrderController');

router.route('/').get(getDispatchOrders).post(createDispatchOrder);
router.route('/:id').get(getDispatchOrderById).put(updateDispatchOrder).delete(deleteDispatchOrder);

module.exports = router;
