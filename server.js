const express = require('express');
const mongoose = require('mongoose'); //for database 
const path = require('path');  // For path manipulation
const cors = require('cors'); //It's a security feature that controls which domains (origins) are allowed to access your backend API.

const app = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== Static Files =====
// Serve uploaded images from "uploads" folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve any static images from public/images (if needed)
// app.use('/images', express.static(path.join(__dirname, 'public/images')));

// ===== Routes =====
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');


app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// ===== MongoDB Connection =====
mongoose.connect('mongodb://localhost:27017/gracestore', {
  //Makes your app compatible with newer MongoDB URI formats.

  useNewUrlParser: true, //Uses the new MongoDB connection string parser.

  //Better handling of server discovery and monitoring

  useUnifiedTopology: true //Enables the new unified topology engine in MongoDB driver.

}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ===== Server Start =====
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Add at the end before app.listen
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!', error: err.message });
});