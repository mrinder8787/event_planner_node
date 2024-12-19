const mongoose = require('mongoose');
const { required } = require('nodemon/lib/config');



const eventItemOwner = new mongoose.Schema({
    customerRef:{
        type:String,
        required:true,
    },
    eventItem: {
        type: [String],
        required: true,
    },
});

module.exports = mongoose.model('eventItemOwners', eventItemOwner);