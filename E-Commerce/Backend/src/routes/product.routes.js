const express = require('express')
const productController = require('../controllers/product.controller')

const productRouter = express.Router()

productRouter.get('/getProducts', productController.getAllProducts)
productRouter.get('/:id', productController.getProductById)
productRouter.post('/create', productController.createProduct)
productRouter.patch('/update/:id', productController.updateProduct)
productRouter.delete('/delete/:id', productController.deleteProduct)

module.exports = productRouter