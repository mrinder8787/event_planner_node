const jwt = require('jsonwebtoken');
require('dotenv').config();
const paymentmodel= require('../model/paymentModel');


exports.payment = async(req ,res)=>{
    const authToken = req.headers.authorization;
    if (!authToken) {
        return res.status(401).json({ error: true, message: 'Unauthorized' });
      }

      try{
        const token = authToken.split(' ')[1]; 
        const decodedToken = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
        
        console.log("decoded token", decodedToken);

        const newPayment = paymentmodel({
            amount,
            crewid,
            bookingid,
            customerRef:decodedToken.customerRef
        });

        await newPayment.save();
        return res.status(200).json({ message: 'Paymnet created successfully', newPayment });

      }catch(error){
        console.error('Error ', error.message);
      }
}