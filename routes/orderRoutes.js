const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// ✅ Create new order
router.post('/', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Get All Orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
    //automatically replace the referenced ObjectId values in your documents with the actual data from the related collections (like User )
      .populate('user', 'name email')
      .populate('items.productId', 'name price category');

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get Order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.productId', 'name price category');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update Order
router.put('/:id', async (req, res) => {
  try {
    const { status, totalAmount, items, shippingAddress } = req.body;

    const updatedData = {
      ...(status && { status }),
      ...(totalAmount && { totalAmount }),
      ...(items && Array.isArray(items) && items.length > 0 && { items }),
      ...(shippingAddress && { shippingAddress }),
    };

    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Delete Order
router.delete('/:id', async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order deleted successfully', order: deletedOrder });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
