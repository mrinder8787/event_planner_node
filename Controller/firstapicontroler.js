
const registrionapi=require('../model/registrion');
const crewentry =require('../model/crewentry');
const jwttoken=require('../jwtToken/jwttoken');
const bcrept = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/registrion');
const booking =require('../model/bookingModel');
const customerEntry=require('../model/customerentryModel');
const enquiery=require('../model/enquiryModel');

const onlyUser =require('../model/customerentryModel');

require('dotenv').config();
 


function generateCustomerRef() {
  const maxLength = 15; 
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let refNumber = '';
  for (let i = 0; i < maxLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    refNumber += characters.charAt(randomIndex);
  }
  return refNumber;
}

//-----------------------------------Registrion API -------------------------------------------------

exports.registraionApi =async (req,res)=>{
  const { email,password } = req.body;
  try{
    const existingUser = await registrionapi.findOne({email});
    
    if(existingUser){
      const passwordMatch =await bcrept.compare(password,existingUser.password);
      if(passwordMatch){
        const expiresIn = 24 * 60 * 60; 
        const token = jwt.sign(
          { userId: existingUser._id, email: existingUser.email },
          process.env.ACCESS_SECRET_TOKEN,
          { expiresIn:expiresIn}
        );

       
        existingUser.Jwttoken = token;
        await existingUser.save();

        return res.status(200).json({
          error: false,
           message:'Login suceessfully!!',
          data:existingUser,
          });
      }else{
        return res.status(400).json({
          error: true,
          message: 'Password does not match',
        });
      }
      
    }else{
       
    const hasPassword =await bcrept.hash(password,10);

    const custmerefNo = generateCustomerRef();
    const registraion= registrionapi({
      email,
      password:hasPassword,
      Jwttoken:jwttoken,
      customerRef:custmerefNo,
    });
  
    const registraionData= await registraion.save();
      return res.status(200).json({
        error: false,
          msg: "Register User Successfully!",
         data:registraionData,
        });
    }
   

  }catch (error) {
    if (error.name === 'ValidationError') {
      const errorMessage = Object.values(error.errors)
        .map(error => error.message)
        .join(', ');
  
      console.log('Validation Error:', errorMessage);
  
      return res.status(400).json({
        error: true,
        message: errorMessage,
      });
    } else {
      // Handle other errors
      console.log('Error:', error);
  
      return res.status(400).json({
        error: true,
        message: 'Enter valid fields!',
      });
    }
  }
  

}
//----------------------------Crew Entry Controller------------------------------------



//---------------------------------------------Get Crew :List------------------------


exports.getCrewByCustomerRef = async (req, res) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ error: true, message: 'Unauthorized: Missing authorization token' });
  }

  try {
   
    const token = authToken.split(' ')[1]; // Assuming the token is in the format "Bearer <token>"
    const decodedToken = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
    console.log('tokendecode', decodedToken);

    
  

   
    const user = await User.findOne({customerRef: decodedToken.customerRef });
    if (!decodedToken || !decodedToken.customerRef) {
      const userTokenMatch = await bcrypt.compare(authToken, user.Jwttoken);
      if(!userTokenMatch){
        return res.status(404).json({ error: true, message: 'User Login Another Devise' });
      }
    }

    if (!user) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }
    if (user.Jwttoken) {
      const userTokenMatch = token === user.Jwttoken;
      if (!userTokenMatch) {
        return res.status(404).json({ error: true, message: 'User Login Another Device' });
      }
    }

    const customerRef = user.customerRef; 
    const crewEntries = await crewentry.find({ customerRef });

    if (!crewEntries || crewEntries.length === 0) {
      return res.status(404).json({ error: true, message: 'No crew entries found for this customer' });
    }

    return res.status(200).json({
      error: false,
      message: 'Crew entries retrieved successfully',
      data: crewEntries,
    });
  } catch (error) {
    console.error('Error fetching crew entries:', error.message);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
    }
    return res.status(500).json({ error: true, message:  error.message });
  }
};

//------------------------------------Customer entry Number -------------------
const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateCustomerId = (customerName, mobileNumber) => {
  const namePart = customerName.substring(0, 4).toUpperCase(); // Take first 4 characters of name
  const randomPart = generateRandomNumber(100000, 999999); // Generate random 6-digit number
  return `${namePart}${randomPart}`;
};

//-------------------------------------Customer Entry --------------------------------------------




//---------------------------------------------Get Crew :List------------------------


exports.getCustomerlist = async (req, res) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ error: true, message: 'Unauthorized: Missing authorization token' });
  }

  try {
    
    const token = authToken.split(' ')[1]; 
    const decodedToken = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
    
    console.log('decoded token',decodedToken);
    if(decodedToken.userid===null || decodedToken.customerRef===null){
      return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
    }
    const user = await User.findOne({ customerRef: decodedToken.customerRef });
    const foundOnlyUser = await onlyUser.findOne({customerId:decodedToken.userid});
  
   
    if (!user) {
      if(foundOnlyUser){
        return res.status(200).json({ error: true, message: 'User found',data:foundOnlyUser});
      }
      return res.status(404).json({ error: true, message: 'User not found' });
    }

    if (user.Jwttoken) {
      const userTokenMatch = token === user.Jwttoken;
      if (!userTokenMatch) {
        return res.status(404).json({ error: true, message: 'User Login Another Device' });
      }
    }

    const foundUser = await registrionapi.findOne({ customerRef: decodedToken.customerRef });

    if (!foundUser) {
      return res.status(404).json({ error: true, message: 'User not found in custom API model' });
    }

   
    const customerRef = user.customerRef; 
    const customerEntries = await customerEntry.find({ customerRef });

    if (!customerEntries || customerEntries.length === 0) {
      return res.status(404).json({ error: true, message: 'No customer entries found for this customer' ,data:Array()});
    }

    return res.status(200).json({
      error: false,
      message: 'Customer entries retrieved successfully',
      data: customerEntries,
    });
  } catch (error) {
    console.error('Error fetching customer entries:', error.message);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
    }
    return res.status(500).json({ error: true, message: 'Server error' });
  }
};


//-----------------------------------Booking api------------------------------



//------------------------------------------------------get booking list------------------------
exports.getBookinglist = async (req, res) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ error: true, message: 'Unauthorized: Missing authorization token' });
  }
  
  try {
    const token = authToken.split(' ')[1]; 
    const decodedToken = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
    console.log('decoded token', decodedToken);
   
    if (!decodedToken) {
      console.error("Failed to decode token:", token);
      return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
    }
    
    if (!decodedToken.customerRef) {
      console.error("Missing customerRef in token:", decodedToken);
      return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
    }
    
    if (!decodedToken.userId) {
      console.error("Missing userId in token:", decodedToken);
      return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
    }

    const userId = decodedToken.userId;
    const user = await User.findById(userId);
   // const userBookings = await booking.find({ customerId: decodedToken.userid });
   
    if (!user) {
      const crewBookings = await booking.find({ crewId: decodedToken.crewid });

      if (!crewBookings || crewBookings.length === 0) {
        return res.status(200).json({
          error: true,
          message: "No bookings found for the crew member",
          data: []
        });
      } else {
        return res.status(200).json({
          error: false,
          message: "Bookings retrieved for crew member",
          data: crewBookings
        });
      }
    }

    // User is found, proceed to fetch bookings based on customerRef
    const foundUser = await registrionapi.findOne({ customerRef: decodedToken.customerRef });

    if (!foundUser) {
      return res.status(404).json({ error: true, message: 'User not found in custom API model' });
    }

    const customerRef = user.customerRef; 
    const bookingEntries = await booking.find({ customerRef });

    if (!bookingEntries || bookingEntries.length === 0) {
      return res.status(404).json({ error: true, message: 'No customer entries found for this customer', data: [] });
    }

    return res.status(200).json({
      error: false,
      message: 'Booking entries retrieved successfully',
      data: bookingEntries,
    });
  } catch (error) {
    console.error('Error fetching customer entries:', error.message);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
    }
    return res.status(500).json({ error: true, message: error.message });
  }
};


//----------------------------------------------Enquier Api --------------------------------------

exports.enquiery= async (req,res)=>{
  const authToken= req.headers.authorization;
  if (!authToken) {
    return res.status(401).json({ error: true, message: 'Unauthorized: Missing authorization token' });
  }
  try{

    const token = authToken.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
console.log('decode token ',decodedToken);

    if (!decodedToken || !decodedToken.customerRef) {
      return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
    }
    const userId = decodedToken.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }
    const { Name, Number, Email, altContact,crewId} = req.body;

    if (!Name || !Number || !Email || !altContact || !crewId) {
      return res.status(400).send('All fields are required');
    }
    const enquirygId = `BOOK-${Date.now()}`;
  
    const newEnquiery = new enquiery({
      Name,
      Number,
      Email,
      altContact,
      customerRef:user.customerRef,
      enquirygId,
      crewId,
    });

    await newEnquiery.save();
    res.status(201).send({ message: 'Enquiery created successfully', newEnquiery });

  }catch(erroe){
    return res.status(400).json({
      error:true,
      message:erroe.message,
      data:Array()
    });
  }


}