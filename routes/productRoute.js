const express = require('express');
const { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct, getProductsByCategory, getProductsByMukhiCount } = require('../controllers/productController');

const router = express.Router();

router.post('/createProduct', createProduct);
router.get('/getProduct/:id', getProduct);
router.get('/getAllProducts', getAllProducts);
router.patch('/updateProduct/:id', updateProduct);
router.delete('/deleteProduct/:id', deleteProduct);
router.get('/getProductsByCategory/:category', getProductsByCategory);
router.get('/getProductsByMukhiCount/:count', getProductsByMukhiCount);

module.exports = router;
