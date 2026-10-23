
const express = require('express');
const router = express.Router();
const {
  getPurchaseRequests,
  getPurchaseRequestById,
  createPurchaseRequest,
  updatePurchaseRequest,
  deletePurchaseRequest
} = require('../controllers/purchaseRequestController');

router.route('/').get(getPurchaseRequests).post(createPurchaseRequest);
router.route('/:id').get(getPurchaseRequestById).put(updatePurchaseRequest).delete(deletePurchaseRequest);

module.exports = router;
