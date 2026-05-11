const productModel = require('../models/product.model')

// GET ALL PRODUCTS 
const getAllProducts = async (req, res) => {
    try {
        const products = await productModel.find()

        if (products.length === 0) {
            return res.status(200).json({ message: 'No products found', products: [] })
        }

        res.json(products)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// GET PRODUCT BY ID
const getProductById = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id)

        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        res.json(product)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// CREATE PRODUCT
const createProduct = async (req, res) => {
    try {
        const product = new productModel(req.body)
        await product.save()
        res.status(201).json(product)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// UPDATE PRODUCT
const updateProduct = async (req, res) => {
    try {
        const product = await productModel.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        )

        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        res.status(200).json({ message: 'Product updated successfully', product })

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid product ID' })
        }
        res.status(500).json({ message: error.message })
    }
}

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
    try {
        const product = await productModel.findByIdAndDelete(req.params.id)

        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        res.json({ message: 'Product deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}