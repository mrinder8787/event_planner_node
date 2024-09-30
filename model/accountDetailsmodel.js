const mongoose = require('mongoose');

const accountDetailsShecma = new mongoose.Schema({
   accountHolderName:{
    type:String,
    requerd:true,
   },
   accountNumber:{
    type:String,
    requerd:true,
   },
   ifscCode:{
    type:String,
    requerd:true,
   },
   branchName:{
    type:String,
    requerd:true,
   },
   bankName:{
    type:String,
    requerd:true,
   },
  
  customerRef:{
    type:String,
    required: true,
  },
 
});

module.exports = mongoose.model('AccountDetails', accountDetailsShecma);
