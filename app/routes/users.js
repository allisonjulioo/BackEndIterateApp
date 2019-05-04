const express = require('express');
const router = express.Router();
const userController = require('../api/controllers/users');  

router.get('/', userController.getAll);
router.get('/:userId', userController.getById);

router.post('/register', userController.create);
router.post('/authenticate', userController.authenticate);  

router.put('/:userId', userController.updateById);

router.delete('/:userId', userController.deleteById);
router.delete('/', userController.deleteAllUsers);


router.get('/:userId/documents', userController.getAllDocumentsByUserId);
router.get('/:userId/documents/:documentId', userController.getUserDocumentById); 
router.post('/:userId/documents', userController.newDocumentByUserId);
router.put('/:userId/documents/:documentId', userController.updateDocumentByUserId);
router.delete('/:userId/documents/:documentId', userController.deleteDocumentByUserId);


module.exports = router;