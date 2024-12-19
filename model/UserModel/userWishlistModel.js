const mongoose = require('mongoose');


const userWishlistModel = new mongoose.Schema({
    bussinessId: { type: String, required: true, unique: true },
    customerRef: { type: String },
    userId: { type: String },
}, { timestamps: true });


module.exports = new mongoose.model("userWishlistModels", userWishlistModel);

