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
   fullAddress:{
    type:String,
    requerd:true,
   },
   state:{
    type:String,
    requerd:true,
   },
   city:{
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
  },
  crewName:{
    type:String,
  },
  deleted:{
    type:Boolean,
    default:false 
   }
},{ timestamps: true });

module.exports = mongoose.model('Enquiry', enquiryShecma);
