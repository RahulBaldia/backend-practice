const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ],
    total: {
        type: Number,
        required: true
    }
});

const orderModel = mongoose.model('Order', orderSchema);

module.exports = orderModel;
