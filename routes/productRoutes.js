const express = require('express');
const router = express.Router(); 
const Product = require('../models/Product'); // Mongoose model
const multer = require('multer');  // For file uploads
const path = require('path');  // For path manipulation
 
// Bulk Add Products
router.post('/bulk', async (req, res) => {
  try {
    const products = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Invalid or empty product list' });
    }

    const savedProducts = await Product.insertMany(products);
    res.status(201).json(savedProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Add Product
router.post('/', async (req, res) => {
  try {
    const {
      name,
      prices,
      stockQuantity,
      category,
      description,
      image,
      isCustomizable,
      CustomizationDescription
    } = req.body;

    const newProduct = new Product({
      name,
      prices,
      stockQuantity,
      category,
      description,
      image,
      isCustomizable,
      CustomizationDescription
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Get All Products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get Product By ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Invalid ID format or server error' });
  }
});

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/images')); // stores in public/images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `img-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ storage });

// Upload route
router.post('/upload', upload.single('productImage'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.status(200).json({ filename: req.file.filename });
});
// Update Product By ID
router.put('/:id', async (req, res) => {
  try {
    const {
      name,
      prices,
      stockQuantity,
      category,
      description,
      image,
      isCustomizable,
      CustomizationDescription
    } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        prices,
        stockQuantity,
        category,
        description,
        image,
        isCustomizable,
        CustomizationDescription
      },
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: 'Invalid ID format or server error' });
  }
});

//Delete Product By ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully', deletedProduct });
  } catch (err) {
    res.status(500).json({ error: 'Invalid ID format or server error' });
  }
});

//Search Product by Name (Case-Insansitive)
router.get('/search', async (req, res) => {
  const { name, category } = req.query;
  const query = {};

  if (name) query.name = new RegExp(name, 'i'); 
  if (category) query.category = category;

  try {
    const products = await Product.find(query);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Get Product in pages 1-5 
//Paginated Product List
router.get('/paginated', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const products = await Product.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Product.countDocuments();

    res.status(200).json({ total, page, limit, products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 