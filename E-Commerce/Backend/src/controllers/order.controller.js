const cartModel = require('../models/cart.model');
const orderModel = require('../models/order.model');

// CREATE ORDER (Cart → Order)
const createOrder = async (req, res) => {
    try {
        // 1. Get cart
        const cart = await cartModel.findOne().populate('items.product');

        // 2. Check empty cart
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // 3. Create order
        const order = new orderModel({
            items: cart.items
        });

        const total = cart.items.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
        }, 0);

        order.total = total;

        // 4. Save order
        await order.save();

        // 5. Clear cart
        cart.items = [];
        await cart.save();

        // 6. Send response
        res.status(201).json(order);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await orderModel.find().populate('items.product');

        if (orders.length === 0) {
            return res.status(200).json({ message: "No orders found" });
        }

        res.json(orders);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    getOrders
};