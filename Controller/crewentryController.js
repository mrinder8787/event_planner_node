const jwt = require('jsonwebtoken');
const User = require('../model/registrion');
const crewentry = require('../model/crewentry');
require('dotenv').config();
const bcrept = require('bcrypt');


const multer = require('multer');
const path = require('path');
const fs = require('fs');

//----------------------------------------Multter Start -==========================================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      const uploadPath = path.resolve(__dirname, '../crewImage');

      if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath); 
  },
  filename: function (req, file, cb) {
           cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
      return cb(null, true);
  } else {
      cb(new Error('Only image files are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }
}).single('image');





///---------------------------------------------Multer End ----------------------------------
const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateCustomerId = (customerName, mobileNumber) => {
  const namePart = customerName.substring(0, 5).toUpperCase();
  const randomPart = generateRandomNumber(100000, 999999);
  return `${namePart}${randomPart}`;
};

exports.crewentry = async (req, res) => {
  const authToken = req.headers.authorization;
  if (!authToken) {
    return res.status(401).json({ error: true, message: 'Unauthorized' });
  }
  upload(req, res,async function (err) {
    if (err instanceof multer.MulterError) {
      console.error('Multer Error:', err.message);
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    } else if (err) {
      console.error('Error:', err.message);
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    if (!req.file) {
      console.error('No file uploaded');
      return res.status(400).json({
        success: false,
        message: 'Image is required.',
      });
    }
    try{
      const { crewName, crewNumber, crewEmail, altPerson, altContact, Gender, Address, State, City, pincode,
        Adharcard, crewType, password, crewSalary, inDate, crewSkil, canAddCoustomer, canAddBooking, canAddEnquery, dateofBirth } = req.body;
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
    
        const user = await User.findOne({ customerRef: decodedToken.customerRef });
        if (user.Jwttoken) {
          const userTokenMatch = token === user.Jwttoken;
          if (!userTokenMatch) {
            return res.status(404).json({ error: true, message: 'User Login Another Device' });
          }
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
        let imageUrl = `/api/crewImage/${req.file.filename}`;
        const hashedPassword = await bcrept.hash(password, 10);
        const crewId = generateCustomerId(crewName, crewNumber);

        const newCrewEntry = new crewentry({
          crewid: crewId,
          crewName,
          crewNumber,
          crewEmail,
          altPerson,
          altContact,
          Gender,
          Address,
          State,
          City,
          pincode,
          Adharcard,
          crewType,
          crewpassword: hashedPassword,
          crewSalary,
          inDate,
          crewSkil,
          customerRef: user.customerRef,
          dateofBirth,
          canAddCoustomer,
          canAddBooking,
          canAddEnquery,
          crewImage:imageUrl,
        });

        const savedCrewEntry = await newCrewEntry.save();
        console.log("crew Add ",savedCrewEntry);
        return res.status(200).json({
          error: false,
          message: 'Crew Entry Saved Successfully!',
          data: savedCrewEntry,
        });    
    }catch(error){
      console.log('Catch error', error.message);
      return res.status(500).json({
        error:true,
        message:error.message
      })
    }

  });

};



exports.getCrewNamelist = async (req, res) => {
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
      error: false,
      message: "Crew list Fatch",
      data: crewData
    })

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message
    })
  }

}