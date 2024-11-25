const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt');
const registrionapi = require('../model/registrion');
const crewentry = require('../model/crewentry');

exports.passwordchange = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ error: true, message: 'Unauthorized' });
  }

  try {
    const token = authToken.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);

    console.log('Decoded token:', decodedToken);

    const userFound = await registrionapi.findOne({ customerRef: decodedToken.customerRef, _id: decodedToken.userId });
    console.log('User found:', userFound);
    
    if (!userFound) {
      const CrewFound = await crewentry.findOne({ crewid: decodedToken.crewid });
      console.log('Crew found:', CrewFound);
      console.log('Crew password:', CrewFound ? CrewFound.crewpassword : 'No password field');

      if (!CrewFound) {
        return res.status(404).json({ error: true, message: 'User or Crew not found' });
      }

      if (CrewFound && typeof CrewFound.crewpassword === 'string') {
        const passwordMatch = await bcrypt.compare(oldPassword, CrewFound.crewpassword);
        if (!passwordMatch) {
          return res.status(400).json({ error: true, message: 'Old password is incorrect' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);
        CrewFound.crewpassword = hashedNewPassword;

        await CrewFound.save();
        return res.status(200).json({ error: false, message: 'Crew Password changed successfully' });
      } else {
        return res.status(400).json({ error: true, message: 'Crew password is missing or invalid' });
      }
    }

    if (userFound && typeof userFound.password === 'string') {
      const passwordMatch = await bcrypt.compare(oldPassword, userFound.password);
      if (!passwordMatch) {
        return res.status(400).json({ error: true, message: 'Old password is incorrect' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);
      userFound.password = hashedNewPassword;

      await userFound.save();
      return res.status(200).json({ error: false, message: 'Password changed successfully' });
    } else {
      return res.status(400).json({ error: true, message: 'User password is missing or invalid' });
    }

  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: true, message: error.message });
  }
};


