const mongoose = require('mongoose'); //imports the library,used to define schemas and interact with MongoDB in an object-oriented way.

const productSchema = new mongoose.Schema({ //the structure of an order document in MongoDB
  name: { type: String, required: true },
  image: String,
  prices: {
    small: { type: Number },
    medium: { type: Number },
    large: { type: Number }
  },
  stockQuantity: { type: Number, required: true },
  category: { type: String, required: true },
  description: String,
  isCustomizable: Boolean,
  CustomizationDescription: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
