const mongoose = require('mongoose');

const registraion = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true, 
      lowercase: true,
      validate: {
        validator: function (value) {
          return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value);
        },
        message: props => `${props.value} is not a valid email address!`,
      },
  },
  password:{
    type: String,
    required: true,
  },
  resetPasswordOTP: String,
  resetPasswordOTPExpires: Date,
 Jwttoken:String,
 customerRef:String,
 otp: {
  type: String
}
});

module.exports = mongoose.model('OwnerRegistrions', registraion);
