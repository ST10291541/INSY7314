//const https = require('https');
//const fs = require('fs');
//const app = require('./app'); // Your Express app
//require('dotenv').config();

//const PORT = process.env.PORT || 5000;

//const options = {
  //key: fs.readFileSync(path.resolve('C:/Users/lab_services_student/Downloads/mkcert/localhost-key.pem')),
  //cert: fs.readFileSync(path.resolve('C:/Users/lab_services_student/Downloads/mkcert/localhost.pem')),
//};

//https.createServer(options, app).listen(5000, () => {
  //console.log('HTTPS server running on https://localhost:5000');
//});

const fs = require('fs');
const https = require('https');
const mongoose = require('mongoose');
const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// SSL configuration
const sslOptions = {
  key: fs.readFileSync('./ssl/privatekey.pem'),
  cert: fs.readFileSync('./ssl/certificate.pem'),
};

// Connect to MongoDB and start the HTTPS server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    https.createServer(sslOptions, app).listen(PORT, () => {
      console.log(`Secure server running at https://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
