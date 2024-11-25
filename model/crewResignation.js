const mongoose = require('mongoose');


const crewResin = new mongoose.Schema({
    CustomerRef:{
        type:String,
        requerd:true,
       },
       CrewId:{
        type:String,
        requerd:true,
       },
       crewName:{
        type:String,
        requerd:true,
       },
       reason:{
        type:String,
        requerd:true,
       },
       additionalComment:{
        type:String,
        requerd:true,
       },
       status:{
        type:String,
        default:"Pending"
       },
       crewFreeDate:{
        type:String,
       }
});

module.exports = mongoose.model('crewResignation',crewResin)