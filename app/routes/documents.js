const express = require('express');
const router = express.Router();
const documentsController = require('../api/controllers/documents');
router.get('/', documentsController.getAll);
router.post('/', documentsController.create);
router.get('/:documentId', documentsController.getById);
router.put('/:documentId', documentsController.updateById);
router.delete('/:documentId', documentsController.deleteById);
module.exports = router;