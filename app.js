const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
require('dotenv').config();

const app = express();
const port = 3000;
const Product = require('./addproduct');

// Middleware to parse JSON and handle CORS
app.use(express.json());
app.use(cors({
  origin: 'https://parisudhamcottonindus.netlify.app',
}));


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST route to handle form submissions
app.post('/addproduct', upload.single('productImage'), async (req, res) => {
  try {
    const { productName, productPrice } = req.body;
    const productImage = {
      data: req.file.buffer,
      contentType: req.file.mimetype // The MIME type of the image
    };

    const product = new Product({
      ProductName: productName,
      ProductPrice: productPrice,
      ProductImage: productImage
    });

    await product.save();
    res.status(201).send('Product added successfully');
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).send('Failed to store product: ' + error.message);
  }
});



app.get('/getProducts', async (req, res) => {
  try {
    const products = await Product.find();

    // Convert each product's image buffer to a Base64 string with the MIME type
    const productsWithImages = products.map(product => ({
      ...product._doc,  // Spread the other properties of the product
      ProductImage: product.ProductImage.data ? `data:${product.ProductImage.contentType};base64,${product.ProductImage.data.toString('base64')}` : null
    }));

    res.status(200).json(productsWithImages);
  } catch (error) {
    console.error('Error retrieving products:', error);
    res.status(500).send('Failed to retrieve products: ' + error.message);
  }
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
