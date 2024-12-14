const jwt = require('jsonwebtoken');
const User = require('../model/registrion');
const crewentry = require('../model/crewentry');
require('dotenv').config();
const booking = require('../model/bookingModel');
const customerEntry = require('../model/customerentryModel');
const bookingDeleteModel= require('../model/bookingDeleteModel');

exports.booking = async (req, res) => {
  const authToken = req.headers.authorization;
  if (!authToken) {
    return res.status(401).json({ error: true, message: 'Unauthorized: Missing authorization token' });
  }

  try {
    const token = authToken.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);

    if (!decodedToken) {

      return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
    }

    if (!decodedToken.customerRef) {

      return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
    }

    if (!decodedToken.userId) {

      return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
    }
    const userId = decodedToken.userId;
    const user = await User.findById(userId);
    const crewFound = await crewentry.findOne({ crewid: decodedToken.crewid });
    const CustomerFound = await customerEntry.findOne({ customerId: decodedToken.userid });

    if (!user) {

      //-------------------------  Add Booking By Crew Member -------------------------------

      if (crewFound) {
        if (crewFound.canAddBooking === false) {
          return res.status(403).json({ error: true, message: 'Permission denied: Crew member cannot add booking' });
        } else {
          const { Name, Number, Email, altContact, bookingitem, address, state, city, bookingEvent, inDate, bookingAmount, advanceAmount } = req.body;

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
            bookingEvent,
            inDate,
            bookingAmount,
            advanceAmount,
          });

          await newBooking.save();
          return res.status(200).json({ message: 'Booking created successfully', newBooking });
        }

        //----------------------------------Customer By ADD Booking By Customer Ref----------------------------

      } else if (CustomerFound) {
        const { customerRef, bookingitem } = req.body;
        console.log('user ', CustomerFound);
        const bookingId = `BOOK-${Date.now()}`;
        const newBooking = new booking({
          Name: CustomerFound.customerName,
          Number: CustomerFound.customerNumber,
          Email: CustomerFound.customerEmail,
          altContact: CustomerFound.altContact,
          customerRef: customerRef,
          bookingId: bookingId,
          customerId: decodedToken.userid,
          bookingitem,
          bookingEvent,
          inDate,
          bookingAmount,
          advanceAmount,
        });

        await newBooking.save();
        return res.status(200).json({ message: 'User Booking created successfully', data: newBooking });

        // return res.status(400).json({ error: true, message: 'User not found',data: CustomerFound});


      } else {
        return res.status(400).json({ error: true, message: 'User not found' });
      }
    }

    //------------------------------------Admin (Owener) Add Booking ---------------------------------

    const { Name, Number, Email, altContact, bookingitem, address, state, city, bookingEvent, inDate, bookingAmount, advanceAmount } = req.body;

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
      bookingEvent,
      inDate,
      bookingAmount,
      advanceAmount,
    });

    await newBooking.save();
    return res.status(200).json({ message: 'Admin Booking created successfully', data: newBooking });

  } catch (error) {
    console.log('catch error', error);
    return res.status(500).json({ error: true, message: 'Server error' });
  }
};





//-----------------------------------------------Booking Update --------------------------------------

exports.bookingUpdate = async (req, res) => {
  const authToken = req.headers.authorization;
  const { id } = req.params;
  const updateData = req.body;

  if (!authToken) {
    return res.status(401).json({ error: true, message: 'Unauthorized: Missing authorization token' });
  }

  try {

    const token = authToken.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);

    if (!decodedToken) {
      return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
    }

    if (!decodedToken.customerRef || !decodedToken.userId) {
      return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
    }


    const user = await User.findOne({ customerRef: decodedToken.customerRef });
    if (user && user.Jwttoken !== token) {
      return res.status(404).json({ error: true, message: 'User Login Another Device' });
    }


    const updatedBooking = await booking.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ error: true, message: 'Booking not found' });
    }

    return res.status(200).json({
      error: false,
      message: 'Booking updated successfully',
      data: updatedBooking
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message
    });
  }
};

//------------------------------------------------Only Status Update -------------------------------------------


exports.bookingStatusUpdate = async (req, res) => {
  const authToken = req.headers.authorization;
  const { id } = req.params;
  const { status } = req.body;

  if (!authToken) {
    return res.status(401).json({ error: true, message: 'Unauthorized: Missing authorization token' });
  }

  try {
    const token = authToken.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);

    if (!decodedToken) {
      return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
    }

    if (!decodedToken.customerRef || !decodedToken.userId) {
      return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
    }

    const user = await User.findOne({ customerRef: decodedToken.customerRef });
    if (user && user.Jwttoken !== token) {
      return res.status(404).json({ error: true, message: 'User Login Another Device' });
    }


    if (!status) {
      return res.status(400).json({ error: true, message: 'Status is required to update' });
    }


    const updatedBooking = await booking.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ error: true, message: 'Booking not found' });
    }

    return res.status(200).json({
      error: false,
      message: 'Booking status updated successfully',
      data: updatedBooking
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message
    });
  }
};


//----------------------------------Booking GetName And Id ==========================

exports.getBookinglistName = async (req, res) => {
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
   
    if (!user) {
      console.error(" userId => ", userId);
     return res.status(404).json({
      error:true,
      message:"User Not Found"
     })
    }
    const bookingEntries = await booking.find({ customerRef:decodedToken.customerRef, __v: 0 })
    .select('Name bookingId _id');

    if (!bookingEntries || bookingEntries.length === 0) {
      return res.status(404).json({ error: true, message: 'No customer entries found for this customer', data: [] });
    }
    console.log("booking Fetach",bookingEntries);
    return res.status(200).json({
      error: false,
      message: 'Booking entries retrieved successfully',
      data: bookingEntries,
    });
  } catch (error) {
    console.error('Error fetching getBookinglistName :', error.message);

    return res.status(500).json({ error: true, message: error.message });
  }
};


//-------------------------------------------- Booking Delete ------------------------------------------------


exports.bookingDelete = async (req,res)=>{
  const authToken = req.headers.authorization;
  const { _id } = req.params;
  if (!authToken) {
    return res.status(401).json({ error: true, message: 'Unauthorized: Missing authorization token' });
  }
  try {
    const token = authToken.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);

    if (!decodedToken) {
      return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
    }

    if (!decodedToken.customerRef) {
      return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
    }

    if (!decodedToken.userId) {
      return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
    }

    const user = await User.findOne({customerRef:decodedToken.customerRef });
    if (user.Jwttoken) {
      const userTokenMatch = token === user.Jwttoken;
      if (!userTokenMatch) {
        return res.status(404).json({ error: true, message: 'User Login Another Device' });
      }
    }
    const bookingToDelete = await booking.findById(_id);

    if (!bookingToDelete) {
      return res.status(404).json({
        error: true,
        message: "Booking not found."
      });
    }

  
    const deletedBooking = new bookingDeleteModel(customerToDelete.toObject());
    await deletedBooking.save();
    await booking.findByIdAndDelete(_id);
    return res.status(200).json({
      error: false,
      message: "Booking delete successfully."
    });
  } catch (error) {
    console.log("Catch error", error.message);
    return res.status(500).json({
      error: true,
      message: error.message
    });
  }

}