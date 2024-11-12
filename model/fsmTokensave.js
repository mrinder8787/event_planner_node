const mongoose = require('mongoose');

const fsmtokenShecma = new mongoose.Schema({
   fsmToken:{
    type:String,
    requerd:true,
   },
   CustomerRef:{
    type:String,
    requerd:true,
   },
 
},{ timestamps: true });

module.exports = mongoose.model('OwnerFsmToken', fsmtokenShecma);
