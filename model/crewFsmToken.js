const mongoose = require('mongoose');

const fcmtokenShecma = new mongoose.Schema({
   fcmToken:{
    type:String,
    requerd:true,
   },
   CustomerRef:{
    type:String,
    requerd:true,
   },
   CrewId:{
    type:String,
    requerd:true,
   },
 
});

module.exports = mongoose.model('CrewFsmToken', fcmtokenShecma);
