const mongoose = require('mongoose');
const { required } = require('nodemon/lib/config');

const userBaseregistraion = new mongoose.Schema({
  password:{
    type: String,
  },
  mobileNumber:{
    type: String,
    required:true,
  },
 Jwttoken:String,
 userid:{
    type: String,
    unique: true,
    required:true,
  },
  lastLogin:{
    type: Date ,
    required:true,
  },
 deleted:{
  type:Boolean,
  default:false 
 },
 name:{
  type: String,
 },
 email:{
  type: String,
 },
}, { timestamps: true });

module.exports = mongoose.model('UserBaseRegistrions', userBaseregistraion);
