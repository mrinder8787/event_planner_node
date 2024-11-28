const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const registrionapi = require('../model/registrion');
const sendMail = require('../Controller/mailController');
const otpSendAdmin = require('../model/adminotpSendModel');
const crewentry = require('../model/crewentry');
require('dotenv').config();

const generateCustomerRef = () => {
  return 'CUST-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.registraionApi = async (req, res) => {
  const { email, otp, name, bussinesName, mobileNumber } = req.body;
  try {
    const existingUser = await registrionapi.findOne({ email });
    const owenerOtpVerify = await otpSendAdmin.findOne({ email });
    console.log("otp view ", owenerOtpVerify)
    if (!owenerOtpVerify) {
      return res.status(400).json({
        error: true,
        message: "Invalid OTP",
      });
    }
    if (owenerOtpVerify.otp !== otp) {
      console.log("otp -->", owenerOtpVerify.otp)
      return res.status(400).json({
        error: true,
        message: "OTP does not match",
      });
    }

    if (!otp) {
      return res.status(400).json({
        error: true,
        message: 'Otp field are requerd',
      });
    }
    if (existingUser) {
      return res.status(400).json({
        error: true,
        message: 'email already Exits',
      });
    }
    const hashedPassword = await bcrypt.hash(owenerOtpVerify.password, 10);
    const customerRefNo = generateCustomerRef();

    const newUser = new registrionapi({
      email: owenerOtpVerify.email,
      password: hashedPassword,
      customerRef: customerRefNo,
      name,
      bussinesName,
      mobileNumber,
    });

    const registrationData = await newUser.save();
    await otpSendAdmin.deleteOne({ email });
    if (registrationData) {
      const expiresIn = 24 * 60 * 60;
      const token = jwt.sign(
        { userId: registrationData._id, customerRef: registrationData.customerRef },
        process.env.ACCESS_SECRET_TOKEN,
        { expiresIn: expiresIn }
      );
      registrationData.Jwttoken = token;
      await registrationData.save();
      return res.status(200).json({
        error: false,
        msg: 'Register User Successfully! OTP Verified',
        data: registrationData,
      });
    }


  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.message,
    });
  }
};

exports.ownerloginApi = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const existingUser = await registrionapi.findOne({ email });
    const owenerOtpVerify = await otpSendAdmin.findOne({ email });
    console.log("otp view ", owenerOtpVerify)
    const crewexistingUser = await crewentry.findOne({ crewEmail: email });
    if (!owenerOtpVerify) {
      return res.status(400).json({
        error: true,
        message: "Invalid OTP",
      });
    }
    if (owenerOtpVerify.otp !== otp) {
      console.log("otp -->", owenerOtpVerify.otp)
      return res.status(400).json({
        error: true,
        message: "OTP does not match",
      });
    }

    if (!otp) {
      return res.status(400).json({
        error: true,
        message: 'Otp field are requerd',
      });
    }

    if (owenerOtpVerify.otp !== otp) {
      console.log("otp -->", owenerOtpVerify.otp)
      return res.status(400).json({
        error: true,
        message: "Invalid OTP, does not match",
      });
    }

    ///-------------------------------Bussiner Owener Login -------------------------------
    if (existingUser) {
      if (existingUser.__v == 1) {
        return res.status(400).json({
          error: true,
          message: 'Your Account Deleted ! Connect Help Support',
        });
      }
      console.log("login Successfully", existingUser)
      const passwordMatch = await bcrypt.compare(owenerOtpVerify.password, existingUser.password);
      if (passwordMatch) {
        const expiresIn = 24 * 60 * 60;
        const token = jwt.sign(
          { userId: existingUser._id, customerRef: existingUser.customerRef },
          process.env.ACCESS_SECRET_TOKEN,
          { expiresIn: expiresIn }
        );
        existingUser.Jwttoken = token;
        await existingUser.save();
        console.log("login Successfully", existingUser);
        await otpSendAdmin.deleteOne({ email });
        return res.status(200).json({
          error: false,
          message: 'Admin Login successful!',
          data: [existingUser],
        });
      } else {
        return res.status(400).json({
          error: true,
          message: 'Incorrect password.',
        });
      }
    }

    //---------------------------Crew Login -----------------------
    if (crewexistingUser) {
      if (crewexistingUser.__v == 1) {
        return res.status(400).json({
          error: true,
          message: 'Your Account Deleted ! Connect your Owner',
        });
      }
      const passwordMatch = await bcrypt.compare(owenerOtpVerify.password, crewexistingUser.crewpassword);
      if (passwordMatch) {
        const expiresIn = 24 * 60 * 60;
        const token = jwt.sign(
          { userId: crewexistingUser._id, customerRef: crewexistingUser.customerRef, crewid: crewexistingUser.crewid },
          process.env.ACCESS_SECRET_TOKEN,
          { expiresIn: expiresIn }
        );

        crewexistingUser.jwttoken = token;
        await crewexistingUser.save();
        await otpSendAdmin.deleteOne({ email });
        return res.status(200).json({
          error: false,
          message: 'Crew Login successful!',
          data: [crewexistingUser],
        });

      } else {
        return res.status(400).json({
          error: false,
          message: 'Crew Password & Email Not Match',
          data: Array(),
        });
      }
    }

    return res.status(400).json({
      error: true,
      message: "Data not found"
    })

  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.message,
    });
  }
};


exports.adminSendRegistrionMail = async (req, res) => {
  const { email, password, brand, device, model, type } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        error:true,
         message: 'Email id is required. & Passowrd' });
    }
    if (!brand || !device) {
      return res.status(400).json({ error: 'Device details requerd' });
    }
    const existingUser = await registrionapi.findOne({ email });
    const crewexistingUser = await crewentry.findOne({ crewEmail: email });
    if (crewexistingUser && type === "Login") {
      const passwordMatch = await bcrypt.compare(password, crewexistingUser.crewpassword);
      if (!passwordMatch) {
        return res.status(400).json({
          error: true,
          message: 'Wrong password',
        });
      }

      const otp = generateOTP();
      await sendMail(
        email,
        `Event Planner: ${type} OTP Verification`,
        `Dear User,
      
    Thank you for ${type} with Event Planner. To complete your ${type}, please use the OTP (One-Time Password) provided below:
    
    Your OTP code is: [${otp}]
    
    Please enter this OTP in the provided field on the ${type} page to verify your email address and complete your ${type} process.
    
    **Device Details:**
    - Device Brand: [${brand}]
    - Device: [${device}]
    - Device Model: [${model}]

    If you didn't request this OTP, please ignore this email.
    
    Thank you,  
    Event Planner Team
    `
      );
      let otpRecord = await otpSendAdmin.findOne({ email });
      if (otpRecord) {
        otpRecord.otp = otp;
        otpRecord.password = password;
        otpRecord.otpExpires = Date.now() + 10 * 60 * 1000;
        await otpRecord.save();
        console.log("Updated OTP:", otpRecord.otp);
      } else {
        const newOtpSend = new otpSendAdmin({
          email,
          password,
          otp,
          otpExpires: Date.now() + 10 * 60 * 1000,
        });
        otpRecord = await newOtpSend.save();
        console.log("Generated new OTP:", otpRecord);
      }

      return res.status(200).json({
        error: false,
        message: `OTP Sent to Your Mail`,
      });

    }

    console.log("Updated OTP:999=>", existingUser);
    if (!existingUser && type === "Login") {
      return res.status(400).json({
        error: true,
        message: 'Please signup',
      });
    }
    if (existingUser) {
      const passwordMatch = await bcrypt.compare(password, existingUser.password);
      console.log("Updated OTP:", passwordMatch);
      if (!passwordMatch) {
        return res.status(400).json({
          error: true,
          message: 'Wrong password',
        });
      }
      const otp = generateOTP();
      await sendMail(
        email,
        `Event Planner: ${type} OTP Verification`,
        `Dear User,
      
    Thank you for ${type} with Event Planner. To complete your ${type}, please use the OTP (One-Time Password) provided below:
    
    Your OTP code is: [${otp}]
    
    Please enter this OTP in the provided field on the ${type} page to verify your email address and complete your ${type} process.
    
    **Device Details:**
    - Device Brand: [${brand}]
    - Device: [${device}]
    - Device Model: [${model}]

    If you didn't request this OTP, please ignore this email.
    
    Thank you,  
    Event Planner Team
    `
      );



      let otpRecord = await otpSendAdmin.findOne({ email });

      if (otpRecord) {
        otpRecord.otp = otp;
        otpRecord.password = password;
        otpRecord.otpExpires = Date.now() + 10 * 60 * 1000;
        await otpRecord.save();
        console.log("Updated OTP:", otpRecord.otp);
      } else {
        const newOtpSend = new otpSendAdmin({
          email,
          password,
          otp,
          otpExpires: Date.now() + 10 * 60 * 1000,
        });
        otpRecord = await newOtpSend.save();
        console.log("Generated new OTP:", otpRecord);
      }

      return res.status(200).json({
        error: false,
        message: `OTP Sent to Your Mail`,
      });
    }

    const otp = generateOTP();
    await sendMail(
      email,
      `Event Planner: ${type} OTP Verification`,
      `Dear User,
      
    Thank you for ${type} with Event Planner. To complete your ${type}, please use the OTP (One-Time Password) provided below:
    
    Your OTP code is: [${otp}]
    
    Please enter this OTP in the provided field on the ${type} page to verify your email address and complete your ${type} process.
    
    **Device Details:**
    - Device Brand: [${brand}]
    - Device: [${device}]
    - Device Model: [${model}]

    If you didn't request this OTP, please ignore this email.
    
    Thank you,  
    Event Planner Team
    `
    );



    let otpRecord = await otpSendAdmin.findOne({ email });

    if (otpRecord) {
      otpRecord.otp = otp;
      otpRecord.password = password;
      otpRecord.otpExpires = Date.now() + 10 * 60 * 1000;
      await otpRecord.save();
      console.log("Updated OTP:", otpRecord.otp);
    } else {
      const newOtpSend = new otpSendAdmin({
        email,
        password,
        otp,
        otpExpires: Date.now() + 10 * 60 * 1000,
      });
      otpRecord = await newOtpSend.save();
      console.log("Generated new OTP:", otpRecord);
    }

    return res.status(200).json({
      error: false,
      message: `OTP Sent to Your Mail`,
    });

  } catch (err) {
    return res.status(500).json({
      error: true,
      message: err.message
    });
  }
};



//-----------------------Bussinis Owener Delete Account -----------------------


exports.bussinessOwnerdelete = async (req, res) => {
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
    const owner = await registrionapi.findOne({ _id: decodedToken.userId, __v: 0 });
    if (owner) {
      await registrionapi.findByIdAndUpdate(
        decodedToken.userId,
        { __v: 1 },
        { new: true }
      );

      return res.status(200).json({
        error: false,
        message: "Deleted successfully",
      });
    }

    return res.status(400).json({
      error: true,
      message: "Your Account Already Delete"
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message || 'Internal Server Error',
    });
  }
};
