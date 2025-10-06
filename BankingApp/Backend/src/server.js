const fs = require('fs');
const https = require('https');
const mongoose = require('mongoose');
require('dotenv').config();

// Import your Express app
const app = require('./app');

const PORT = process.env.PORT || 5000;

// SSL configuration - make sure these file paths are correct
const sslOptions = {
  key: fs.readFileSync('./ssl/privatekey.pem'),
  cert: fs.readFileSync('./ssl/certificate.pem'),
};

// Connect to MongoDB and start the HTTPS server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    
    https.createServer(sslOptions, app).listen(PORT, () => {
      console.log(`Secure server running at https://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });