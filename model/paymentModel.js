const mongoose = require('mongoose');
const paymentSchema= mongoose.Schema({
    amount:{
        type:String,
    requerd:true,
    },
crewid:{
    type:String,
    requerd:true,
},
bookingid:{
    type:String,
},
customerRef:{
    type:String,
    required: true,
  },
})

module.exports = mongoose.model('Crew Payments', paymentSchema);
