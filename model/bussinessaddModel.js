const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BusinessSchema = new Schema({
  BussinessName: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  fullAdress: {
    type: String,
    required: true
  },
  maxBidAmount: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  customerRef:{
    type:String,
    required: true,
  },
},{ timestamps: true });

module.exports = mongoose.model('Business', BusinessSchema);
