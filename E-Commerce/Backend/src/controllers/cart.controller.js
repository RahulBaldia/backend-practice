const cartModel = require('../models/cart.model');
const productModel = require('../models/product.model');

// GET CART
const getCart = async (req, res) => {
    try {
        const cart = await cartModel.findOne().populate('items.product');

        if (!cart) {
            return res.status(200).json({ message: "Cart is empty", cart: null });
        }

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ADD TO CART
const addProductToCart = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: "productId is required in body" });
        }

        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let cart = await cartModel.findOne();

        if (!cart) {
            cart = new cartModel({
                items: [{ product: productId, quantity: 1 }]
            });
        } else {
            const existingItem = cart.items.find(
                item => item.product.toString() === productId
            );

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.items.push({ product: productId, quantity: 1 });
            }
        }

        await cart.save();

        const updatedCart = await cartModel.findById(cart._id).populate('items.product');
        res.status(200).json(updatedCart);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// REMOVE PRODUCT FROM CART
// DELETE /api/cart/removeProduct/:productId
// productId = product ka _id (jo items.product mein store hai)
const removeProductFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        const cart = await cartModel.findOne();
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const item = cart.items.find(
            item => item.product.toString() === productId
        );

        if (!item) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        if (item.quantity > 1) {
            // ✅ Sirf quantity kam karo
            item.quantity -= 1;
        } else {
            // ✅ Quantity 1 hai toh pura remove karo
            cart.items = cart.items.filter(
                item => item.product.toString() !== productId
            );
        }

        await cart.save();

        const updatedCart = await cartModel.findById(cart._id).populate('items.product');
        res.status(200).json(updatedCart);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE QUANTITY
// PATCH /api/cart/updateProduct/:productId
const updateProductInCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: "quantity must be 1 or more" });
        }

        const cart = await cartModel.findOne();
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const item = cart.items.find(
            item => item.product.toString() === productId
        );

        if (!item) {
            return res.status(404).json({ message: "Product not in cart" });
        }

        item.quantity = quantity;
        await cart.save();

        const updatedCart = await cartModel.findById(cart._id).populate('items.product');
        res.status(200).json(updatedCart);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCart,
    addProductToCart,
    removeProductFromCart,
    updateProductInCart
};