const mongoose = require('mongoose');


const adminOtpsend= new mongoose.Schema({
    email:{
        type:String,
        requerd:true
    },
    otp:{
        type:String,

    },
    otpExpires:{
        type:String,
    },
    password:{
        type: String,
        required: true,
      },

});

module.exports = mongoose.model('AdminOtpsend', adminOtpsend);