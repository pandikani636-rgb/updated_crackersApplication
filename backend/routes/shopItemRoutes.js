const express = require('express');
const router = express.Router();
const {
  getShopItems,
  createShopItem,
  updateShopItem,
  deleteShopItem
} = require('../controllers/shopItemController');

router.route('/')
  .get(getShopItems)
  .post(createShopItem);

router.route('/:id')
  .put(updateShopItem)
  .delete(deleteShopItem);

module.exports = router;
