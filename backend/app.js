require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Untuk mengatasi CORS policy antara frontend dan backend

const app = express();
const PORT = process.env.PORT || 5000;

// Koneksi ke MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Middleware
app.use(cors()); // Izinkan semua permintaan CORS dari frontend
app.use(express.json()); // Untuk parsing JSON dari body request

// Routes
const postsRouter = require('./routes/posts');
app.use('/api/posts', postsRouter);

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to SMA Islam Nurul Khalil Blog API!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});