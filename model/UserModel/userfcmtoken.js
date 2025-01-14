const mongoose = require('mongoose');

const userFsmtokenShecma = new mongoose.Schema({
   fcmToken:{
    type:String,
    requerd:true,
   },
   userid:{
    type: String,
    unique: true,
    required:true,
  },
 
},{ timestamps: true });

module.exports = mongoose.model('userBaseFsmToken', userFsmtokenShecma);