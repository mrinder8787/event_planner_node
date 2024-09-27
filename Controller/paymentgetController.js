const paymentModel = require('../model/paymentModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();


exports.paymentget=async(req,res)=>{
    const authToken = req.headers.authorization;
    if (!authToken) {
      return res.status(401).json({ error: true, message: 'Unauthorized: Missing authorization token' });
    }
    try{
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
        const payment = await paymentModel.find({customerRef:decodedToken.customerRef});
        console.log("payment ",payment)
        if(payment){
            return res.status(200).json({
                error: true,
                message: 'Payment Fetch Successfully',
                data:[payment]
              });
        }else{
            return res.status(200).json({
                error: true,
                message: 'User Not Found',
                data:[]
              });  
        }

    }catch(error){
        console.log("error",error.message);
        return res.status(200).json({
            error: true,
            message:error,
          }); 
    }

}