const mongoose = require('mongoose');

const enquiryShecma = new mongoose.Schema({
   Name:{
    type:String,
    requerd:true,
   },
   Number:{
    type:String,
    requerd:true,
   },
   Email:{
    type:String,
    requerd:true,
   },
   altContact:{
    type:String,
    requerd:true,
   },
  customerRef:{
    type:String,
    required: true,
  },
  enquirygId:{
    type:String
  },
  crewId:{
    type:String,
    required:true,
  },
  deleted:{
    type:Boolean,
    default:false 
   }
});

module.exports = mongoose.model('Enquiry', enquiryShecma);