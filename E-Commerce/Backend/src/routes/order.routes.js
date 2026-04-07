const express = require('express');
const orderController = require('../controllers/order.controller');

const orderRouter = express.Router();

orderRouter.post('/createOrder', orderController.createOrder);
orderRouter.get('/getOrder', orderController.getOrders);

module.exports = orderRouter;
