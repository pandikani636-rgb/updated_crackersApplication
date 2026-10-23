
const express = require('express');
const router = express.Router();
const {
  getExports,
  getExportById,
  createExport,
  updateExport,
  deleteExport
} = require('../controllers/exportController');

router.route('/').get(getExports).post(createExport);
router.route('/:id').get(getExportById).put(updateExport).delete(deleteExport);

module.exports = router;
