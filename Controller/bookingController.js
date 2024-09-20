const jwt = require('jsonwebtoken');
const User = require('../model/registrion');
const crewentry =require('../model/crewentry');
require('dotenv').config();
const booking =require('../model/bookingModel');
const customerEntry = require('../model/customerentryModel');

exports.booking = async (req, res) => {
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
      const crewFound = await crewentry.findOne({ crewid: decodedToken.crewid });
      const CustomerFound = await customerEntry.findOne({customerId:decodedToken.userid});
  
      if (!user) {

//-------------------------  Add Booking By Crew Member -------------------------------
  
        if (crewFound) {
          if (crewFound.canAddBooking === false) {
            return res.status(403).json({ error: true, message: 'Permission denied: Crew member cannot add booking' });
          } else {
              const { Name, Number, Email, altContact,bookingitem,address,state,city } = req.body;
  
            if (!Name || !Number || !Email || !altContact || !bookingitem || !address || !state || !city) {
              return res.status(400).json({ error: true, message: 'All fields are required' });
            }
  
            const bookingId = `BOOK-${Date.now()}`;
            const newBooking = new booking({  
              Name,
              Number,
              Email,
              altContact,
              address,
              state,
              city,
              customerRef: crewFound.customerRef,
              bookingId,
              crewId: decodedToken.crewid,
              crewname: crewFound.crewName,
              bookingitem,
            });
  
            await newBooking.save();
            return res.status(200).json({ message: 'Booking created successfully', newBooking });
          }

//----------------------------------Customer By ADD Booking By Customer Ref----------------------------

        } else if(CustomerFound){
          const { customerRef,bookingitem}=req.body;
          console.log('user ',CustomerFound);
          const bookingId = `BOOK-${Date.now()}`;
          const newBooking = new booking({
            Name:CustomerFound.customerName,
            Number:CustomerFound.customerNumber,
            Email:CustomerFound.customerEmail,
            altContact:CustomerFound.altContact,
            customerRef:customerRef,
            bookingId:bookingId,
            customerId:decodedToken.userid,
            bookingitem,
          });
      
          await newBooking.save();
          return res.status(200).json({ message: 'User Booking created successfully', data:newBooking });

          // return res.status(400).json({ error: true, message: 'User not found',data: CustomerFound});
          

        }else{
          return res.status(400).json({ error: true, message: 'User not found' });
        }
      }
  
//------------------------------------Admin (Owener) Add Booking ---------------------------------

      const { Name, Number, Email, altContact,bookingitem,address,state,city } = req.body;
  
      if (!Name || !Number || !Email || !altContact || !bookingitem || !address || !state || !city) {
        return res.status(400).json({ error: true, message: 'All fields are required' });
      }
  
      const bookingId = `BOOK-${Date.now()}`;
      const newBooking = new booking({
        Name,
        Number,
        Email,
        altContact,
        address,
        state,
        city,
        customerRef: user.customerRef,
        bookingId,
        bookingitem,
      });
  
      await newBooking.save();
      return res.status(201).json({ message: 'Admin Booking created successfully', data:newBooking });
  
    } catch (error) {
      console.log('catch error', error);
      return res.status(500).json({ error: true, message: 'Server error' });
    }
  };
  