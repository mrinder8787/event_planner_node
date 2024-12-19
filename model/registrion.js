const mongoose = require('mongoose');
const { required } = require('nodemon/lib/config');

const registraion = new mongoose.Schema({
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
  customerRef: {
    type:String,
    required:true,
    unique: true,
  },
  otp: {
    type: String
  }
},{ timestamps: true });

module.exports = mongoose.model('OwnerRegistrions', registraion);
