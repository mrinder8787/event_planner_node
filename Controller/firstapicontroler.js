
const registrionapi = require('../model/registrion');
const crewentry = require('../model/crewentry');
const jwt = require('jsonwebtoken');
const User = require('../model/registrion');
const booking = require('../model/bookingModel');
const customerEntry = require('../model/customerentryModel');
const enquiery = require('../model/enquiryModel');

const onlyUser = require('../model/customerentryModel');
require('dotenv').config();



//---------------------------------------------Get Crew :List------------------------


exports.getCrewByCustomerRef = async (req, res) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ error: true, message: 'Unauthorized: Missing authorization token' });
  }

  try {
    const token = authToken.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
    console.log('tokendecode', decodedToken);

    const user = await User.findOne({ customerRef: decodedToken.customerRef });
    if (!decodedToken || !decodedToken.customerRef) {
      const userTokenMatch = await bcrypt.compare(authToken, user.Jwttoken);
      if (!userTokenMatch) {
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
    const crewEntries = await crewentry.find({ customerRef, __v: 0 });

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
    return res.status(500).json({ error: true, message: error.message });
  }
};




exports.getCustomerlist = async (req, res) => {
  const authToken = req.headers.authorization;
  if (!authToken) {
    return res.status(401).json({ error: true, message: 'Unauthorized: Missing authorization token' });
  }

  try {
    const token = authToken.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);

    if (!decodedToken || !decodedToken.customerRef) {
      return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
    }

    const user = await User.findOne({ customerRef: decodedToken.customerRef });

    if (decodedToken.crewid) {
      const crewToken = await crewentry.findOne({ crewid: decodedToken.crewid, customerRef: decodedToken.customerRef });
      if (crewToken?.Jwttoken && token !== crewToken.Jwttoken) {
        return res.status(404).json({ error: true, message: 'User Login Another Device' });
      }

      // Pagination setup
      let page = parseInt(req.query.page) || 1;
      let limit = 10;
      let skip = (page - 1) * limit;

      const totalRecords = await customerEntry.countDocuments({ customerRef: decodedToken.customerRef, crewId: decodedToken.crewid });
      const customerCrewEntries = await customerEntry.find({ customerRef: decodedToken.customerRef, crewId: decodedToken.crewid })
        .skip(skip)
        .limit(limit)
        .lean();

      return res.status(200).json({
        error: false,
        message: customerCrewEntries.length ? 'Crew found Customer list' : 'No customer entries found',
        data: customerCrewEntries,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        currentPage: page
      });
    }

    if (!user) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }

    if (user?.Jwttoken && token !== user.Jwttoken) {
      return res.status(404).json({ error: true, message: 'User Login Another Device' });
    }

    // Pagination setup
    let page = parseInt(req.query.page) || 1;
    let limit = 10;
    let skip = (page - 1) * limit;

    const totalRecords = await customerEntry.countDocuments({ customerRef: user.customerRef });
    const customerEntries = await customerEntry.find({ customerRef: user.customerRef })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      error: false,
      message: customerEntries.length ? 'Customer entries retrieved successfully' : 'No customer entries found',
      data: customerEntries,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      currentPage: page
    });

  } catch (error) {
    console.error('Error fetching customer entries:', error.message);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
    }
    return res.status(500).json({ error: true, message: error.message });
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

    if (!decodedToken || !decodedToken.customerRef || !decodedToken.userId) {
      return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
    }

    const userId = decodedToken.userId;
    const user = await User.findById(userId);

    // Fixed pagination (Always 10 records per page)
    let { page = 1 } = req.query;
    page = parseInt(page);
    const limit = 10;
    const skip = (page - 1) * limit;

    let bookings = [];
    let totalBookings = 0;

    if (!user) {
      // Fetch crew bookings
      totalBookings = await booking.countDocuments({ crewId: decodedToken.crewid });
      bookings = await booking.find({ crewId: decodedToken.crewid })
        .skip(skip)
        .limit(limit)
        .select('-__v');

      return res.status(200).json({
        error: false,
        message: "Bookings retrieved for crew member",
        data: bookings,
        totalRecords: totalBookings,
        totalPages: Math.ceil(totalBookings / limit),
        currentPage: page
      });
    }

    // Fetch user details
    const foundUser = await registrionapi.findOne({ customerRef: decodedToken.customerRef });
    if (!foundUser) {
      return res.status(404).json({ error: true, message: 'User not found in custom API model' });
    }

    // Fetch bookings based on customerRef
    const customerRef = user.customerRef;
    totalBookings = await booking.countDocuments({ customerRef });

    bookings = await booking.find({ customerRef })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    if (bookings.length === 0) {
      return res.status(404).json({ error: true, message: 'No bookings found', data: [] });
    }

    return res.status(200).json({
      error: false,
      message: 'Booking entries retrieved successfully',
      data: bookings,
      totalRecords: totalBookings,
      totalPages: Math.ceil(totalBookings / limit),
      currentPage: page
    });

  } catch (error) {
    console.error('Error fetching bookings:', error.message);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
    }
    return res.status(500).json({ error: true, message: error.message });
  }
};



//----------------------------------------------Enquier Api --------------------------------------

exports.enquiery = async (req, res) => {
  const authToken = req.headers.authorization;
  const { Name, Number, Email, altContact, fullAddress,state,city } = req.body;
  if (!Name || !Number || !Email || !altContact) {
    return res.status(400).send('All fields are required');
  }

  if (!authToken) {
    return res.status(401).json({ error: true, message: 'Unauthorized: Missing authorization token' });
  }
  try {

    const token = authToken.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
    console.log('decode token ', decodedToken);

    if (!decodedToken || !decodedToken.customerRef) {
      return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
    }
    const userId = decodedToken.userId;
    const user = await User.findById(userId);
    const crewIdentiy = await crewentry.findOne({ crewid: decodedToken.crewid });
    if (user?.Jwttoken || crewIdentiy?.Jwttoken) {
      const userTokenMatch = token === user?.Jwttoken;
      const crewTokenMatch = token === crewIdentiy?.Jwttoken;
      console.log("chek crew ", crewIdentiy);
      if (!userTokenMatch && !crewTokenMatch) {
        return res.status(404).json({ error: true, message: 'User Login Another Device' });
      }
    }
    const enquieryNumberCheck = await enquiery.findOne({ Number });
    if (enquieryNumberCheck) {
      console.log("enquiery Number Check already Exit", enquieryNumberCheck);
      return res.status(404).json({
        error: true,
        message: "This mobile number already Exits"
      });
    }

    if (decodedToken.crewid) {
      if (crewIdentiy.canAddEnquery === false) {
        return res.status(404).json({
          error: true,
          message: "Admin not permnision add enquery"
        });
      }
      const enquirygId = `ENQUIR-${Date.now()}`;
      const crewNewEnquiery = new enquiery({
        Name,
        Number,
        Email,
        state,
        city,
        altContact,
        customerRef: decodedToken.customerRef,
        enquirygId,
        fullAddress,
        crewId: decodedToken.crewid,
        crewName: crewIdentiy.crewName
      });

      const crewEnquieryData = await crewNewEnquiery.save();
      return res.status(200).json({
        message: 'Crew enquiery created successfully',
        data: crewEnquieryData
      })
    }
    if (!user) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }

    const enquirygId = `ENQUIR-${Date.now()}`;

    const newEnquiery = new enquiery({
      Name,
      Number,
      Email,
      state,
      city,
      altContact,
      customerRef: user.customerRef,
      enquirygId,
      fullAddress,
    });

    const enquieryData = await newEnquiery.save();
    return res.status(200).json({
      message: 'Enquiery created successfully',
      data: enquieryData
    });


  } catch (erroe) {
    return res.status(400).json({
      error: true,
      message: erroe.message,
      data: Array()
    });
  }


}


//--------------------------------Get Enquery -----------------------------------------------------
exports.getEnquerylist = async (req, res) => {
  const authToken = req.headers.authorization;
  console.log("token", authToken);

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
    const crewIdentiy = await crewentry.findOne({ crewid: decodedToken.crewid });

    if (user?.Jwttoken || crewIdentiy?.Jwttoken) {
      const userTokenMatch = token === user?.Jwttoken;
      const crewTokenMatch = token === crewIdentiy?.Jwttoken;
      console.log("chek crew ", crewIdentiy);
      if (!userTokenMatch && !crewTokenMatch) {
        return res.status(404).json({ error: true, message: 'User Login Another Device' });
      }
    }

    // Pagination setup
    let page = parseInt(req.query.page) || 1;
    let limit = 10;
    let skip = (page - 1) * limit;

    if (decodedToken.crewid) {
      const totalRecords = await enquiery.countDocuments({ crewId: decodedToken.crewid, customerRef: decodedToken.customerRef });
      const crewEnquieryData = await enquiery.find({ crewId: decodedToken.crewid, customerRef: decodedToken.customerRef })
        .skip(skip)
        .limit(limit)
        .lean();

      return res.status(200).json({
        error: false,
        message: crewEnquieryData.length ? "Enquiry retrieved for crew member" : "No enquiry found for the crew member",
        data: crewEnquieryData,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        currentPage: page
      });
    }

    if (!user) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }

    const customerRef = user.customerRef;
    const totalRecords = await enquiery.countDocuments({ customerRef });
    const enquieryEntries = await enquiery.find({ customerRef })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      error: false,
      message: enquieryEntries.length ? 'Enquiry Entries retrieved successfully' : 'No customer entries found for this customer',
      data: enquieryEntries,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      currentPage: page
    });

  } catch (error) {
    console.error('Error fetching customer entries:', error.message);
    return res.status(500).json({ error: true, message: error.message });
  }
};

