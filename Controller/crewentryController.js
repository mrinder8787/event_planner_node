const jwt = require('jsonwebtoken');
const User = require('../model/registrion');
const crewentry = require('../model/crewentry');
require('dotenv').config();
const bcrept = require('bcrypt');


const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateCustomerId = (customerName, mobileNumber) => {
  const namePart = customerName.substring(0, 5).toUpperCase();
  const randomPart = generateRandomNumber(100000, 999999);
  return `${namePart}${randomPart}`;
};

exports.crewentry = async (req, res) => {
  const { crewName, crewNumber, crewEmail, altPerson, altContact, Gender, Address, State, City, pincode,
    Adharcard, crewType, password, crewSalary, inDate, crewSkil, canAddCoustomer, canAddBooking, canAddEnquery } = req.body;
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ error: true, message: 'Unauthorized' });
  }

  try {
    const token = authToken.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
    console.log("decodecrew ", decodedToken);
    const userId = decodedToken.userId;


    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }

    const existingCrewNumber = await crewentry.findOne({ crewNumber, customerRef: user.customerRef });
    if (existingCrewNumber) {
      return res.status(400).json({ error: true, message: 'Crew number already exists' });
    }


    const existingCrewEmail = await crewentry.findOne({ crewEmail, customerRef: user.customerRef });
    if (existingCrewEmail) {
      return res.status(400).json({ error: true, message: 'Crew email already exists' });
    }

    const existingAdharcard = await crewentry.findOne({ Adharcard, customerRef: user.customerRef });
    if (existingAdharcard) {
      return res.status(400).json({ error: true, message: 'Adharcard number already exists' });
    }
    const hasPassword = await bcrept.hash(password, 10);
    const crewId = generateCustomerId(crewName, crewNumber);

    const newCrewEntry = new crewentry({
      userId: user._id,
      crewid: crewId,
      crewName: req.body.crewName,
      crewNumber: req.body.crewNumber,
      crewEmail: req.body.crewEmail,
      altPerson: req.body.altPerson,
      altContact: req.body.altContact,
      Gender: req.body.Gender,
      Address: req.body.Address,
      State: req.body.State,
      City: req.body.City,
      pincode: req.body.pincode,
      Adharcard: req.body.Adharcard,
      crewType: req.body.crewType,
      crewpassword: hasPassword,
      crewSalary: req.body.crewSalary,
      inDate: req.body.inDate,
      crewSkil: req.body.crewSkil,
      customerRef: user.customerRef,
      canAddCoustomer,
      canAddBooking,
      canAddEnquery,
    });

    const savedCrewEntry = await newCrewEntry.save();


    return res.status(200).json({
      error: false,
      message: 'Crew Entry Saved Successfully!',
      data: savedCrewEntry,
    });
  } catch (error) {
    console.error('Error saving crew entry:', error.message);
    if (error.message === 'invalid signature') {
      return res.status(400).json({ error: true, message: 'Please login Unauthorized' });
    }
    return res.status(400).json({ error: true, message: 'Error saving crew entry' });
  }
};



exports.getCrewNamelist=async(req,res)=>{
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

    if (!decodedToken.customerRef || !decodedToken.userId) {
        return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
    }

    const user = await User.findOne({ customerRef: decodedToken.customerRef });
    if (user && user.Jwttoken !== token) {
        return res.status(404).json({ error: true, message: 'User Login Another Device' });
    }

    const crewData = await crewentry.find({ customerRef: decodedToken.customerRef, __v: 0 })
                                         .select('crewName crewid _id');
    return res.status(200).json({
      error:false,
      message :"Crew list Fatch",
      data:crewData
    })

  }catch(error){
    return res.status(500).json({
      error:true,
      message:error.message
    })
  }

}