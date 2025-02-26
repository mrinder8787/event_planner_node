const mongoose = require('mongoose');



const userEventBookModel = new mongoose.Schema({
    bussinessId: { type: String, required: true,},
    customerRef: { required: true, type: String },
    userId: {
        required: true,
        type: String
    },
    bussinessName:{type: String},
    bussinessLogo:{type: String},
    pinCode: { required: true, type: String },
    state: { required: true, type: String },
    city: { required: true, type: String },
    userOfferAmount: { type: String },
    ownerAmount: { type: String },
    altMobileNumber: { type: String },
    advanceAmount: { type: String },
    fullAddress:{ type: String},
    bookingitem: {
        type: [String],
        required: true,
    },
    bookingEvent: {
        type: [String],
        required: true,
    },
    eventDate: {
        type: Date,
        required: true,
    },
    eventToDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        default: "Request Send"
    },
    
    rejectReason: {
        type: String,
    },
}, { timestamps: true });


module.exports = new mongoose.model("userBookEvents", userEventBookModel);
