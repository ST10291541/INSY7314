const fs = require('fs');
const https = require('https');
const mongoose = require('mongoose');
require('dotenv').config();

// Import Express app
const app = require('./app');

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Make the server accessible outside container


// SSL configuration
const sslOptions = {
  key: fs.readFileSync('./ssl/privatekey.pem'),
  cert: fs.readFileSync('./ssl/certificate.pem'),
};

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');

   app.listen(PORT, HOST, () => {
      console.log(`Server running at http://${HOST}:${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
