const mongoose = require('mongoose'); //imports the library,used to define schemas and interact with MongoDB in an object-oriented way.

const userSchema = new mongoose.Schema({ //the structure of an order document in MongoDB
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
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
