const express = require('express');
const router = express.Router();
const cateItemController = require('../controllers/cateItem.controller');
const {authenticateToken} = require('../middlewares/auth');
const role = require('../middlewares/role');

router.get('/', cateItemController.getAllCateItems);
router.get('/:id', cateItemController.getCateItemById);
router.delete('/:id', cateItemController.deleteCateItem);
router.put('/:id', cateItemController.updateCateItem);
router.post('/', authenticateToken, role(['admin']), cateItemController.createCateItem);
module.exports = router;
