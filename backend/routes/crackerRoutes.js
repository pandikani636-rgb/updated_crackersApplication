
const express = require('express');
const router = express.Router();
const {
  getCrackers,
  getCrackerById,
  createCracker,
  updateCracker,
  deleteCracker
} = require('../controllers/crackerController');

router.route('/').get(getCrackers).post(createCracker);
router.route('/:id').get(getCrackerById).put(updateCracker).delete(deleteCracker);

module.exports = router;
