const mongoose = require('mongoose');

// Define the schema for the Product model
const productSchema = mongoose.Schema({
  ProductName: {
    type: String,
    required: true
  },
  ProductPrice: {
    type: Number,
    required: true
  },
  ProductImage: {
    data: Buffer,
    contentType: String // Optional but useful to store MIME type
  }
});


module.exports = mongoose.model('Product', productSchema);
