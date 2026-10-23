
const express = require('express');
const router = express.Router();
const {
  getBoms,
  getBomById,
  createBom,
  updateBom,
  deleteBom
} = require('../controllers/bomController');

router.route('/').get(getBoms).post(createBom);
router.route('/:id').get(getBomById).put(updateBom).delete(deleteBom);

module.exports = router;
