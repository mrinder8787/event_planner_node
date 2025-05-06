const mongoose = require('mongoose');


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
 status:{
  type: String,
  default:"Active"
 },
 isVerified:{
  type:Boolean,
  default:true,
 }
}, { timestamps: true });

module.exports = mongoose.model('UserBaseRegistrions', userBaseregistraion);
