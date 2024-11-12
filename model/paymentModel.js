const mongoose = require('mongoose');
const paymentSchema= mongoose.Schema({
    amount:{
        type:String,
    requerd:true,
    },
crewid:{
    type:String,
},
bookingid:{
    type:String,
},
otherExpenses:{
    type:String,
},
customerRef:{
    type:String,
    required: true,
  },
},{ timestamps: true });

module.exports = mongoose.model('Crew Payments', paymentSchema);
