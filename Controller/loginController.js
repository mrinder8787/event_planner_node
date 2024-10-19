const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const registrionapi=require('../model/registrion'); 
const crewentry =require('../model/crewentry');
require('dotenv').config();




exports.loginApi = async (req, res) => {
  const { email, password } = req.body;
  try {
   
    const existingUser = await registrionapi.findOne({email});
    console.log("s",existingUser);
    const crewexistingUser = await crewentry.findOne({crewEmail:email});
    if (existingUser) {
      console.log("login Successfully",existingUser)
      const passwordMatch = await bcrypt.compare(password, existingUser.password);
      if (passwordMatch) {
        const expiresIn = 24 * 60 * 60;
        const token = jwt.sign(
          { userId: existingUser._id, customerRef: existingUser.customerRef },
          process.env.ACCESS_SECRET_TOKEN,
          { expiresIn: expiresIn }
        );
        existingUser.Jwttoken = token;
        await existingUser.save();
        console.log("login Successfully",existingUser)
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
    } else if(crewexistingUser){
        const passwordMatch = await bcrypt.compare(password, crewexistingUser.crewpassword);
      if (passwordMatch) {
        const expiresIn = 24 * 60 * 60;
        const token = jwt.sign(
          { userId: crewexistingUser._id, customerRef: crewexistingUser.customerRef,crewid:crewexistingUser.crewid},
          process.env.ACCESS_SECRET_TOKEN,
          { expiresIn: expiresIn }
        );

        crewexistingUser.jwttoken = token;
        await crewexistingUser.save();
        return res.status(200).json({
          error: false,
          message: 'Crew Login successful!',
          data: [crewexistingUser],
        });

      // return res.status(400).json({
      //   error: true,
      //   message: 'User not found. Please register first.',
      // });
    }else{
      return res.status(400).json({
        error: false,
        message: 'Crew Password & Email Not Match',
        data: Array(),
      });
    }
  }else{
    return res.status(400).json({
      error: true,
      message: "User Not Found",
    });
  }
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Handle Mongoose validation error
      const errorMessage = Object.values(error.errors)
        .map((error) => error.message)
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
};
