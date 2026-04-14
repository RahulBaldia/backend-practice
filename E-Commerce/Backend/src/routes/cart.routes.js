const express = require('express');
const cartController = require('../controllers/cart.controller');

const cartRouter = express.Router();

cartRouter.get('/getCart', cartController.getCart);
cartRouter.post('/addProduct', cartController.addProductToCart);
cartRouter.delete('/removeProduct/:productId', cartController.removeProductFromCart);
cartRouter.patch('/updateProduct/:productId', cartController.updateProductInCart);

module.exports = cartRouter;