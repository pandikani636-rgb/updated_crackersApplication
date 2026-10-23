
const express = require('express');
const router = express.Router();
const {
  getImports,
  getImportById,
  createImport,
  updateImport,
  deleteImport
} = require('../controllers/importController');

router.route('/').get(getImports).post(createImport);
router.route('/:id').get(getImportById).put(updateImport).delete(deleteImport);

module.exports = router;
