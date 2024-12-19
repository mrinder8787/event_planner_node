const mongoose = require('mongoose');
const { required } = require('nodemon/lib/config');


const userAddressModel = mongoose.Schema({
    userId:{
        required:true,
        type:String,
    },
    name:{
        required:true,
        type:String,
    },
    mobileNumber:{
        required:true,
        type:String,
    },
    Address1:{
        required:true,
        type:String,
    },
    state:{
        required:true,
        type:String,
    },
    city:{
        required:true,
        type:String,
    },
    pinCode:{
        required:true,
        type:String,
    },
    defaultAddress:{
        type:Boolean,
        default:false
    }

},{ timestamps: true });
module.exports = mongoose.model('userAddress', userAddressModel);