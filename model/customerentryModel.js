const mongoose = require('mongoose');

const customerEntry = new mongoose.Schema({
   customerName:{
    type:String,
    requerd:true,
   },
   customerNumber:{
    type:String,
    requerd:true,
   },
   customerEmail:{
    type:String,
    requerd:true,
   },
   altContact:{
    type:String,
    requerd:true,
   },
   Address:{
    type:String,
    requerd:true,
   },
   State:{
    type:String,
    requerd:true,
   },
   City:{
    type:String,
    requerd:true,
   },
   pincode:{
    type:String,
    requerd:true,
   },
   reamark:{
    type:String,
    requerd:true,
   },
   customerAge:{
    type:String,
    requerd:true,
   },
   publishDate:{
    type:String,
    requerd:true,
   },

  customerRef:{
    type:String,
    required: true,
  },
  customerId:{
    type:String
  },
  crewId:{
    type:String,
  },
  Whosenameby:String,
  deleted:{
    type:Boolean,
    default:false 
   },
});

module.exports = mongoose.model('Customerentrys', customerEntry);
