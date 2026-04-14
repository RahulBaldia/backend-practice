const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/database");

dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Croma Clone API is running!" });
});

// Routes (baad mein add karenge)
// app.use("/api/products", productRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/cart", cartRoutes);

module.exports = app;