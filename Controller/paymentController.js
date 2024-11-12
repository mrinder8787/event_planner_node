const jwt = require('jsonwebtoken');
require('dotenv').config();
const paymentmodel = require('../model/paymentModel');
const owenerModel = require('../model/registrion');


exports.payment = async (req, res) => {
  const authToken = req.headers.authorization;
  if (!authToken) {
    return res.status(401).json({ error: true, message: 'Unauthorized Token' });
  }
  const { amount, crewid, bookingid, other, otherExpenses } = req.body;

  try {
    const token = authToken.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
    if (!decodedToken || !decodedToken.customerRef || !decodedToken.userId) {
      return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
    }
    const userId = decodedToken.userId;
    const user = await owenerModel.findById(userId);
    if(!user){
      return res.status(404).json({ error: true, message: 'User not found' });
    }
    
    if (user?.Jwttoken) {
      const userTokenMatch = token === user?.Jwttoken;
      if (!userTokenMatch) {
        return res.status(404).json({ error: true, message: 'User Login Another Device' });
      }
    }
    if (other === true) {
      const newOtherPayment = paymentmodel({
        amount,
        otherExpenses,
        bookingid,
        customerRef: decodedToken.customerRef
      });
      await newOtherPayment.save();
      console.log("Other new payment add", newOtherPayment);
      return res.status(200).json({ message: 'otherExpenses Paymnet created successfully', newOtherPayment });
    }

    const newPayment = paymentmodel({
      amount,
      crewid,
      bookingid,
      customerRef: decodedToken.customerRef
    });

    await newPayment.save();
    console.log("new payment add", newPayment);
    return res.status(200).json({ message: 'Paymnet created successfully', newPayment });

  } catch (error) {
    console.error('Error ', error.message);
    return res.status(401).json({
      error: true,
      message: error.message
    });
  }
}