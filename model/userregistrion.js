const mongoose = require('mongoose');

const userregistraion = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true, 
      lowercase: true, 
      validate: {
        validator: function (value) {
          // Regular expression for email validation
          return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value);
        },
        message: props => `${props.value} is not a valid email address!`,
      },
  },
  password:{
    type: String,
    required: true,
  },
 Jwttoken:String,
 userid:String,
 deleted:{
  type:Boolean,
  default:false 
 }
});

module.exports = mongoose.model('Userregistrions', userregistraion);
