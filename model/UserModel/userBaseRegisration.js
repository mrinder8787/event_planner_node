const mongoose = require('mongoose');
const { required } = require('nodemon/lib/config');

const userBaseregistraion = new mongoose.Schema({
    email: {
      type: String,
     // unique: true,
    //  trim: true, 
     // lowercase: true, 
  },
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
 }
}, { timestamps: true });

module.exports = mongoose.model('UserBaseRegistrions', userBaseregistraion);
