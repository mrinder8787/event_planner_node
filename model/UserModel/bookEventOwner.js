const mongoose = require('mongoose');
const { required } = require('nodemon/lib/config');



const bookEventOwner = new mongoose.Schema({
    customerRef:{
        type:String,
        required:true,
    },
    bookEvent: {
        type: [String],
        required: true,
    },
});

module.exports = mongoose.model('bookEventOwners', bookEventOwner);