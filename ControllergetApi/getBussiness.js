const jwt = require('jsonwebtoken');
const bussiness = require('../model/bussinessaddModel');
require('dotenv').config();


exports.getbussiness = async(req,res)=>{
    const authToken = req.headers.authorization;

    if (!authToken) {
      return res.status(401).json({ error: true, message: 'Unauthorized: Missing authorization token' });
    }
    const token = authToken.split(' ')[1]; 
    const decodedToken = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
    if (!decodedToken) {
        console.error("Failed to decode token:", token);
        return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
      }
    try{

        const getbussiness= await bussiness.find();
        return res.status(200).json({ error: true, message: 'Data Fetch Successfully',data:[getbussiness] });

    }catch(error){
        console.log("catch error",error.message);
        return res.status(401).json({ error: true, message:error.message});
    }
}