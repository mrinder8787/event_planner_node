const mongoose = require('mongoose');


const customerBid = mongoose.Schema({
    name: {
        type: String,
        required: true
      },
      MobileNumber: {
        type: String,
        required: true
      },
      Customerid: {
        type: String,
        required: true
      },
      bookingDate:{
        type:String,
        required:true
      },
      bookingitem:{
        type:[String],
        required:true,
      },
      status:{
        type:String,
        default:"Request"
      },

});
module.exports = mongoose.model('CustomerBid', customerBid);