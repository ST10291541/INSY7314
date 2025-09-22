const https = require('https');
const fs = require('fs');
const app = require('./app'); // Your Express app
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const options = {
  key: fs.readFileSync(path.resolve('C:/Users/lab_services_student/Downloads/mkcert/localhost-key.pem')),
  cert: fs.readFileSync(path.resolve('C:/Users/lab_services_student/Downloads/mkcert/localhost.pem')),
};

https.createServer(options, app).listen(5000, () => {
  console.log('HTTPS server running on https://localhost:5000');
});