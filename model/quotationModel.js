const mongoose = require('mongoose');

const QuotationModel = new mongoose.Schema({
    quotationId: { 
        type: String, 
        unique: true, 
        default: () => `QT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      },
    customerRef:{
        type:String,
        required: true,
      },
      customerName:{
        type:String,
        required: true,
      },
      customerEmail:{
        type:String,
        required: true,
      },
      customerPhone:{
        type:String,
        required: true,
      },
      fromDate:{
        type: Date,
        required: true,
      },
      toDate:{
        type: Date,
        required: true,
      },
      bookingitem: {
        type: [String],
        required: true,
    },
    bookingEvent: {
        type: [String],
        required: true,
    },
    pinCode:{
        type: Number,
        required: true,
      },
      city:{
        type: String,
        required: true,
      },
      state:{
        type: String,
        required: true,
      },
   discount:{
        type:String,
        required: true,
      },
      subTotalAmount:{
        type:Number,
        required: true,
      },
      TotalAmount:{
        type:Number,
        required: true,
      },
      includeGstAmount:{
        type:Number,
        required: true,
      },
},{ timestamps: true });


module.exports = mongoose.model('QuotationSend', QuotationModel);