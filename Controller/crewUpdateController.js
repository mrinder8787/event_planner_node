const jwt = require('jsonwebtoken');
const User = require('../model/registrion');
const crewentry = require('../model/crewentry');
require('dotenv').config();
const bcrypt = require('bcrypt');

const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateCustomerId = (customerName, mobileNumber) => {
  const namePart = customerName.substring(0, 5).toUpperCase();
  const randomPart = generateRandomNumber(100000, 999999);
  return `${namePart}${randomPart}`;
};

exports.updateCrewEntry = async (req, res) => {
  const { crewId, crewName, crewNumber, crewEmail, altPerson, altContact, Gender, Address, State, City, pincode, Adharcard, crewType,
    password, crewSalary, inDate, crewSkil, canAddCoustomer, canAddBooking, canAddEnquery } = req.body;
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ error: true, message: 'Unauthorized' });
  }

  try {
    const token = authToken.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
    console.log("decoded token", decodedToken);
    const userId = decodedToken.userId;
    const user = await User.findById(userId);



    if (!user) {

      return res.status(404).json({ error: true, message: 'User not found' });
    }

    console.log('crewid', crewId);
    const existingCrew = await crewentry.findOne({ crewid: crewId, customerRef: user.customerRef });
    if (!existingCrew) {
      return res.status(404).json({ error: true, message: 'Crew entry not found' });
    }

    if (crewNumber) {
      const existingCrewNumber = await crewentry.findOne({ crewNumber, customerRef: user.customerRef, _id: { $ne: existingCrew._id } });
      if (existingCrewNumber) {
        return res.status(400).json({ error: true, message: 'Crew number already exists' });
      }
    }

    if (crewEmail) {
      const existingCrewEmail = await crewentry.findOne({ crewEmail, customerRef: user.customerRef, _id: { $ne: existingCrew._id } });
      if (existingCrewEmail) {
        return res.status(400).json({ error: true, message: 'Crew email already exists' });
      }
    }

    if (Adharcard) {
      const existingAdharcard = await crewentry.findOne({ Adharcard, customerRef: user.customerRef, _id: { $ne: existingCrew._id } });
      if (existingAdharcard) {
        return res.status(400).json({ error: true, message: 'Adharcard number already exists' });
      }
    }

    const updates = {
      ...(crewName && { crewName }),
      ...(crewNumber && { crewNumber }),
      ...(crewEmail && { crewEmail }),
      ...(altPerson && { altPerson }),
      ...(altContact && { altContact }),
      ...(Gender && { Gender }),
      ...(Address && { Address }),
      ...(State && { State }),
      ...(City && { City }),
      ...(pincode && { pincode }),
      ...(Adharcard && { Adharcard }),
      ...(crewType && { crewType }),
      ...(crewSalary && { crewSalary }),
      ...(inDate && { inDate }),
      ...(crewSkil && { crewSkil }),
      ...(canAddCoustomer !== undefined && { canAddCoustomer }),
      ...(canAddBooking !== undefined && { canAddBooking }),
      ...(canAddEnquery !== undefined && { canAddEnquery }),
    };

    if (password) {
      updates.crewpassword = await bcrypt.hash(password, 10);
    }

    const updatedCrewEntry = await crewentry.findByIdAndUpdate(existingCrew._id, updates, { new: true });

    return res.status(200).json({
      error: false,
      message: 'Crew entry updated successfully!',
      data: updatedCrewEntry,
    });
  } catch (error) {
    console.error('Error updating crew entry:', error.message);
    if (error.message === 'invalid signature') {
      return res.status(400).json({ error: true, message: 'Please login Unauthorized' });
    }
    return res.status(500).json({ error: true, message: 'Error updating crew entry' });
  }
};
