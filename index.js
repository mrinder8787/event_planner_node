const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const postRoutes = require('./routers/products');
const cors = require("cors");
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI =  process.env.MONGO_DB_URL;
app.use(cors());
app.use(bodyParser.json());

app.use('/api', postRoutes);

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error('Error connecting to MongoDB:', err));
