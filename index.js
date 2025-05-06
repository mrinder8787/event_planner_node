const express = require('express');
const http = require('http');
const cors = require('cors');
const connectDB = require('./Config/db');
const Routes =  require('./routers/products');
const path = require('path');
const app = express();
const adminRoutes = require('./routers/adminRoute');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require('dotenv').config();

const PORT = process.env.PORT || 5000;

connectDB();
const server = http.createServer(app);

app.use('/api', Routes);
app.use('/api/admin', adminRoutes);
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/crewImage', express.static(path.join(__dirname, 'crewImage')));

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
