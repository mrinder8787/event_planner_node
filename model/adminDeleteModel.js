const mongoose = require('mongoose');

const ownerDelete = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,},
  password: {
    type: String,
    required: true,
  },
  name:{
    type: String,
    required: true,
  },
  bussinesName:{
    type: String,
    required: true,
  },
  mobileNumber:{
    type: String,
    required: true,
  },
  resetPasswordOTP: String,
  resetPasswordOTPExpires: Date,
  Jwttoken: String,
  customerRef: String,
  otp: {
    type: String
  }
},{ timestamps: true });

module.exports = mongoose.model('OwnerDelete', ownerDelete);
