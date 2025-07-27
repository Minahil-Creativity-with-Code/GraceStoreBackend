const express = require('express');
const multer = require('multer');  // For file uploads
const path = require('path');  // For path manipulation
const User = require('../models/User'); // Adjust if path differs

const router = express.Router();

// Multer config for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // directory to save images
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, fileName);
  }
});
const upload = multer({ storage });
// ===== Routes =====

//Login
router.post('/login', async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await User.findOne({ name });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create User
router.post('/', upload.single('profileImage'), async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      profession,
      gender,
      address,
      phone
    } = req.body;

    const newUser = new User({
      name,
      email,
      password,
      role,
      profession,
      gender,
      address,
      phone,
      profileImage: req.file ? req.file.filename : null
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ error: 'Error creating user', details: err.message });
  }
});

// Get All Users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// Get Single User by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: 'Invalid user ID' });
  }
});

// Update User
router.put('/:id', upload.single('profileImage'), async (req, res) => {
  try {
    const updates = { ...req.body };

    if (req.file) {
      updates.profileImage = req.file.filename;
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: 'Error updating user', details: err.message });
  }
});

// Delete User
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid user ID' });
  }
});

module.exports = router;
