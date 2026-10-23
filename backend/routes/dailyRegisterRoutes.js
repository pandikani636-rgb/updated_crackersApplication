const express = require('express');
const router = express.Router();
const {
  getDailyRegisters,
  getOpeningStock,
  saveDailyRegister,
  deleteDailyRegister
} = require('../controllers/dailyRegisterController');

router.get('/opening-stock', getOpeningStock);

router.route('/')
  .get(getDailyRegisters)
  .post(saveDailyRegister);

router.route('/:id')
  .delete(deleteDailyRegister);

module.exports = router;
