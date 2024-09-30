const mongoose = require('mongoose');

const bookingShecma = new mongoose.Schema({
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
  bookingId:{
    type:String
  },
  crewId:{
    type:String,
  },
  crewname:{
    type:String,
  },
  bookingitem:{
    type:[String],
    required:true,
  },
  customerId:{
   type:String, 
  },
  deleted:{
    type:Boolean,
    default:false 
   },
   status:{
    type:String,
    default:"Pending" 
   },
   address:{
    type:String,
    required:true
   },
   state:{
    type:String,
    required:true
   },
   city:{
    type:String,
    required:true
   },
   bookingEvent:{
    type:[String],
    required:true,
  },
});

module.exports = mongoose.model('Booking', bookingShecma);
