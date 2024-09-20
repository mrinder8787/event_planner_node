const mongoose = require('mongoose');

const crewentry = new mongoose.Schema({
   crewName:{
    type:String,
    requerd:true,
   },
   crewNumber:{
    type:String,
    requerd:true,
   },
   crewEmail:{
    type:String,
    requerd:true,
   },
   altPerson:{
    type:String,
    requerd:true,
   },
   altContact:{
    type:String,
    requerd:true,
   },
   Gender:{
    type:String,
    requerd:true,
   },
   Address:{
    type:String,
    requerd:true,
   },
   State:{
    type:String,
    requerd:true,
   },
   City:{
    type:String,
    requerd:true,
   },
   pincode:{
    type:String,
    requerd:true,
   },
   Adharcard:{
    type:String,
    requerd:true,
   },
   crewType:{
    type:String,
    requerd:true,
   },
   crewpassword:{
    type:String,
    requerd:true,
   },
   crewSalary:{
    type:String,
    requerd:true,
   },
   inDate:{
    type:String,
    requerd:true,
   },
   crewSkil: {
    type: [String], 
    required: true,
  },
  customerRef:{
    type:String,
    required: true,
  },
  crewid:{
    type:String,
  },
  canAddCoustomer: {
    type: Boolean,
    default: false,
  },
  canAddBooking: {
    type: Boolean,
    default: false,
  },
  canAddEnquery: {
    type: Boolean,
    default: false,
  },
  resetPasswordOTP: String,
  resetPasswordOTPExpires: Date,
  jwttoken:String,
  deleted:{
    type:Boolean,
    default:false 
   }
});

module.exports = mongoose.model('Crewentrys', crewentry);
