const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

const secretKey = process.env.ACCESS_SECRET_TOKEN;
const expiresIn = 24 * 60 * 60; 

const payload = {}; 

const token = jwt.sign(payload, secretKey, { expiresIn: expiresIn });

module.exports = token;
