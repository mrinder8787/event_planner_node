const mongoose = require('mongoose');
const { required } = require('nodemon/lib/config');


const advancePaymentModel = new mongoose.Schema({
    bussinessId: { type: String, required: true, unique: true },
    customerRef: { required: true, type: String },
    transactionId: { required: true, type: String },
    amount: { required: true, type: String },
    userId: { required: true, type: String },
}, { timestamps: true });
module.exports = mongoose.model("AdvancePaymentUser", advancePaymentModel)