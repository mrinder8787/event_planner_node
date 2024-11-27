const customerEntry = require('../model/customerentryModel');
const jwt = require('jsonwebtoken');
const User = require('../model/registrion');
const crewentry = require('../model/crewentry');
const userRegistrion = require('../model/userregistrion');
require('dotenv').config();


const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateCustomerId = (customerName, mobileNumber) => {
  const namePart = customerName.substring(0, 4).toUpperCase();
  const randomPart = generateRandomNumber(100000, 999999);
  return `${namePart}${randomPart}`;
};


exports.customerentry = async (req, res) => {
  const { customerName, customerNumber, customerEmail, altContact, Address, State, City, pincode, reamark, publishDate,customerAge} = req.body;
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ error: true, message: 'Unauthorized' });
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
    const crewCheck = await crewentry.findOne({ customerRef: decodedToken.customerRef, crewid: decodedToken.crewid });
    const checkCustomerNumber = await customerEntry.findOne({ customerNumber });
    if (checkCustomerNumber) {
      return res.status(404).json({
        error: true,
        message: 'Customer Mobile Number Already register',
        data: []
      });
    }
    if (user?.Jwttoken || crewCheck?.Jwttoken) {
      const userTokenMatch = token === user?.Jwttoken;
      const crewTokenMatch = token === crewCheck?.Jwttoken;
      console.log("chek crew ", crewCheck);
      if (!userTokenMatch && !crewTokenMatch) {
        return res.status(404).json({ error: true, message: 'User Login Another Device' });
      }
    }
    const crew = decodedToken.crewid;

    if (crew) {
      if (crewCheck) {
        if (crewCheck.canAddCoustomer === false) {
          return res.status(404).json({ error: true, message: 'Crew Not A permission' });
        } else {
          //-----------------------save data and permision------------------
          const customerId = generateCustomerId(customerName, customerNumber);
          const newcustomerentry = new customerEntry({
            customerId: customerId,
            customerName: customerName,
            customerNumber: customerNumber,
            customerEmail: customerEmail,
            altContact: altContact,
            Address: Address,
            State: State,
            City: City,
            pincode: pincode,
            Adharcard: req.body.Adharcard,
            reamark: reamark,
            customerRef: decodedToken.customerRef,
            publishDate: publishDate,
            crewId: decodedToken.crewid,
            Whosenameby: crewCheck.crewName,
            customerAge
          });

          const savedcustomerentry = await newcustomerentry.save();

          return res.status(200).json({
            error: false,
            message: 'Crew Customer Entry Saved Successfully!',
            data: savedcustomerentry,
          });

        }
      
      }
    }

    //---------------------Bussiness Owener Add Customere-----------------------------

    const customerId = generateCustomerId(customerName, customerNumber);
    console.log("user dataga");
    const newcustomerentry = new customerEntry({
      customerId: customerId,
      customerName: customerName,
      customerNumber: customerNumber,
      customerEmail: customerEmail,
      altContact: altContact,
      Address: Address,
      State: State,
      City: City,
      pincode: pincode,
      customerAge,
      Adharcard: req.body.Adharcard,
      reamark: reamark,
      customerRef: decodedToken.customerRef,
      publishDate: publishDate,
    });

    const savedcustomerentry = await newcustomerentry.save();

    return res.status(200).json({
      error: false,
      message: 'Customer Entry Saved Successfully!',
      data: savedcustomerentry,
    });
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message, data: Array() });
  }
};