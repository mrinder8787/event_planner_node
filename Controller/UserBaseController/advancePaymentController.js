const jwt = require('jsonwebtoken');
require('dotenv').config();
const userBase = require('../../model/UserModel/userBaseRegisration');
const advancePayment = require("../../model/UserModel/advancePaymentModel");
const businessData = require("../../model/bussinessaddModel");

exports.advancePaymentUser = async (req,res)=>{
    const authToken = req.headers.authorization;
    if (!authToken) {
        return res.status(401).json({ error: true, message: 'Unauthorized: Missing authorization token' });
    }
    try{
        const {bussinessId,customerRef,transactionId,amount,userId}=req.body;
        const token = authToken.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);

        if (!decodedToken || !decodedToken.id || !decodedToken.userId) {
            return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
        }

        const user = await userBase.findOne({ userid: decodedToken.userId, _id: decodedToken.id });

        if (user?.Jwttoken) {
            const userTokenMatch = token === user.Jwttoken;
            if (!userTokenMatch) {
                return res.status(404).json({ error: true, message: 'User logged in on another device' });
            }
        }
        const business = await businessData.findOne({customerRef,_id:bussinessId});
        if(!business){
            return res.status(400).json({
                error:true,
                message:"Business not found"
            });
        }
        const newPayment = await advancePayment({
            bussinessId,
            customerRef,
            transactionId,
            amount,
            userId
        });

        await newPayment.save();
        return res.status(200).json({
            error:false,
            message:"Payment add successfully !",
            data:newPayment,
        })

    }catch(e){
        console.log("Catch error",e.message);
        return res.status(500).json({
            error:true,
            message:e.message
        })
    }
}
