const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsmTokenModel = require("../model/fsmTokensave");
const User = require('../model/registrion');
const crewData = require('../model/crewentry');
const userbase = require('../model/UserModel/userBaseRegisration');

exports.fsmtoken = async (req, res) => {
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
    const { fsmToken } = req.body;

    if (!fsmToken) {
      return res.status(401).json({ error: true, message: 'Fsm Token is Requerd' });
    }
    const user = await User.findOne({ customerRef: decodedToken.customerRef });
    const crew = await crewData.findOne({ customerRef: decodedToken.customerRef, crewid: decodedToken.crewid });
    if (user.Jwttoken || crew.Jwttoken) {
      const userTokenMatch = token === user.Jwttoken || crew.Jwttoken;
      if (!userTokenMatch) {
        return res.status(404).json({ error: true, message: 'User Login Another Device' });
      }
    }
    const fsmcheck = await fsmTokenModel.findOne({ CustomerRef: decodedToken.customerRef });

    if (fsmcheck) {
      fsmcheck.fcmToken = fsmToken;
      await fsmcheck.save();
      return res.status(200).json({ error: false, message: 'FSM Token Updated Successfully!', data: [fsmcheck] });
    }
    if (!fsmcheck) {
      const fsmTokensave = fsmTokenModel({
        fsmToken,
        CustomerRef: decodedToken.customerRef
      });
      await fsmTokensave.save();
      return res.status(200).json({ error: false, message: 'FSM Token Save Succeessfully!', data: [fsmTokensave] });
    }


  } catch (error) {
    console.log("error", error.message);
    return res.status(401).json({ error: true, message: error.message });
  }


}


// -------------------------------> Get FcmToken owner <-------------------------

exports.getFcmToken = async (req, res) => {
  const authToken = req.headers.authorization;
  if (!authToken) {
    return res.status(401).json({ error: true, message: 'Unauthorized: Missing authorization token' });
  }

  try {
    const token = authToken.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
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
    const user = await User.findOne({ customerRef: decodedToken.customerRef });
    const crew = await crewData.findOne({ customerRef: decodedToken.customerRef, crewid: decodedToken.crewid });
    if (user.Jwttoken || crew.Jwttoken) {
      const userTokenMatch = token === user.Jwttoken || crew.Jwttoken;
      if (!userTokenMatch) {
        return res.status(404).json({ error: true, message: 'User Login Another Device' });
      }
    }
    const fsmcheck = await fsmTokenModel.findOne({ CustomerRef: decodedToken.customerRef });

    if (fsmcheck) {
      return res.status(200).json({ error: false, message: 'Fcmtoken fetch successfully!', data: fsmcheck });
    }
    if (!fsmcheck) {
      return res.status(200).json({ error: false, message: 'Fcm Token not found !', });
    }


  } catch (error) {
    console.log("error", error.message);
    return res.status(401).json({ error: true, message: error.message });
  }


}
// -------------------------------> Get FcmToken owner <-------------------------

exports.getFcmTokenOwnerbyUser = async (req, res) => {
  const authToken = req.headers.authorization;
  if (!authToken) {
    return res.status(401).json({ error: true, message: 'Unauthorized: Missing authorization token' });
  }
  try {
    const CustomerRef = req.params.CustomerRef
    if (!CustomerRef) {
      return res.status(401).json({ error: true, message: 'Missing CustomerRef ' });
    }
    const token = authToken.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
    if (!decodedToken) {
      return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
    }

    if (!decodedToken.id) {

      return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
    }

    if (!decodedToken.userId) {

      return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
    }
    const user = await userbase.findOne({ userid: decodedToken.userId, _id: decodedToken.id });
    if (!user) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }

    if (user.Jwttoken) {
      const userTokenMatch = token === user.Jwttoken;
      if (!userTokenMatch) {
        return res.status(404).json({ error: true, message: 'User Login Another Device' });
      }
    }
    const fsmcheck = await fsmTokenModel.findOne({CustomerRef});

    if (fsmcheck) {
      return res.status(200).json({ error: false, message: 'Fcmtoken fetch successfully!', data: fsmcheck });
    }
    if (!fsmcheck) {
      return res.status(200).json({ error: false, message: 'Fcm Token not found !', });
    }


  } catch (error) {
    console.log("error", error.message);
    return res.status(401).json({ error: true, message: error.message });
  }


}