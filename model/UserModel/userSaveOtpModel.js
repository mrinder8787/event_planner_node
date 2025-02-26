const mongoose = require('mongoose');


const userOtpModel = new mongoose.Schema({
    mobileNumber: { type: String, required: true, unique: true },
    otp: { type: String}, 
    otpExpires: { type: String},
},{timestamps:true});


module.exports= new mongoose.model("userOtpModel",userOtpModel);

