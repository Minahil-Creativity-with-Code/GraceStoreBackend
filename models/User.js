const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  profession: String,
  gender: { type: String, enum: ['male', 'female', 'other'], default: 'male' },
  address: String,
  phone: String,
  image: String,
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  bio: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
