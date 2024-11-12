const bookingData = require("../model/bookingModel");
const crewData = require("../model/crewentry");
const customerData = require("../model/customerentryModel");
const enquieryData = require("../model/enquiryModel");
const jwt = require('jsonwebtoken'); 
const User = require('../model/registrion');
require('dotenv').config();

exports.allItemCount = async (req, res) => {
    const authToken = req.headers.authorization;
    if (!authToken) {
        return res.status(401).json({ error: true, message: 'Unauthorized: Missing authorization token' });
    }

    try {
        const token = authToken.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
        console.log('decoded token',decodedToken);
        if (!decodedToken) {
            return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
        }

        if (!decodedToken.customerRef) {
          
            return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
        }

        if (!decodedToken.userId) {
           
            return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
        }
        const user = await User.findOne({ customerRef: decodedToken.customerRef });

        if (user.Jwttoken) {
          const userTokenMatch = token === user.Jwttoken;
          if (!userTokenMatch) {
            return res.status(404).json({ error: true, message: 'User Login Another Device' });
          }
        }

        //-------------------------- Use countDocuments() to get the count of documents------------

        const bookingCount = await bookingData.countDocuments({ customerRef: decodedToken.customerRef ,__v:0});
        const crewCount = await crewData.countDocuments({ customerRef: decodedToken.customerRef ,__v:0});
        const enquieryCount = await enquieryData.countDocuments({ customerRef: decodedToken.customerRef ,__v:0});
        const customerCount = await customerData.countDocuments({ customerRef: decodedToken.customerRef ,__v:0});

        // Return the counts in the response
        return res.status(200).json({
            error: false,
            message: 'Counts retrieved successfully',
            data: {
                bookingCount,
                crewCount,
                enquieryCount,
                customerCount
            }
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message
        });
    }
};


//-------------------------------booking status Count----------------------------------------------


exports.bookingStatusCount = async (req, res) => {
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

        if (!decodedToken.customerRef) {
            return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
        }

        if (!decodedToken.userId) {
            return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
        }

        const user = await User.findOne({ customerRef: decodedToken.customerRef });
        if (user.Jwttoken) {
            const userTokenMatch = token === user.Jwttoken;
            if (!userTokenMatch) {
                return res.status(404).json({ error: true, message: 'User Login Another Device' });
            }
        }

        //-------------------------- Status Count Queries --------------------------
       
        const totalBookingCount = await bookingData.countDocuments({ customerRef: decodedToken.customerRef,__v:0 });
        const pendingCount = await bookingData.countDocuments({ customerRef: decodedToken.customerRef, status: 'Pending',__v:0 });
        const successCount = await bookingData.countDocuments({ customerRef: decodedToken.customerRef, status: 'Success',__v:0 });
        const cancelCount = await bookingData.countDocuments({ customerRef: decodedToken.customerRef, status: 'Cancel',__v:0 });
        const deliverCount = await bookingData.countDocuments({ customerRef: decodedToken.customerRef, status: 'Deliver',__v:0 });
        
        return res.status(200).json({
            error: false,
            message: 'Booking status counts retrieved successfully',
            data: {
                totalBookingCount,
                pendingCount,
                successCount,
                cancelCount,
                deliverCount
            }
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message
        });
    }
};
