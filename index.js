const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const postRoutes = require('./routers/products');
const cors = require("cors");
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI =  process.env.MONGODB_URI;
app.use(cors());
app.use(bodyParser.json());
app.use('/api', postRoutes);
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
   
    app.listen(PORT, () => {
      console.log(`Server is running on: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // Exit process with failure
  });