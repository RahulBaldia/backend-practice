const express = require("express")
const ProductRoutes = require("./routes/product.routes")
const CartRoutes = require("./routes/cart.routes")
const OrderRoutes = require("./routes/order.routes")
const AuthRoutes = require("./routes/auth.routes")
const cors = require('cors');

const app = express()
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/api/products', ProductRoutes)  // ✅
app.use('/api/cart', CartRoutes)         // ✅
app.use('/api/order', OrderRoutes)       // ✅
app.use('/api/auth', AuthRoutes) 

module.exports = app