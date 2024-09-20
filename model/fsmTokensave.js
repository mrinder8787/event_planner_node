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
 
});

module.exports = mongoose.model('FsmToken', fsmtokenShecma);
