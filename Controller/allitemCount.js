const bookingData = require("../model/bookingModel");
const crewData = require("../model/crewentry");
const customerData = require("../model/customerentryModel");
const enquieryData = require("../model/enquiryModel");
const jwt = require('jsonwebtoken'); 
const User = require('../model/registrion');
const leaveData = require('../model/leaveRequestCrewModel');
require('dotenv').config();

exports.allItemCount = async (req, res) => {
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
       const crewMember = await crewData.findOne({ customerRef: decodedToken.customerRef,crewid:decodedToken.crewid});
        if (user.Jwttoken || crewMember.Jwttoken) {
          const userTokenMatch = token === user.Jwttoken;
          const crewTokenMatch = token === crewMember?.Jwttoken;
          if (!userTokenMatch && !crewTokenMatch) {
            return res.status(404).json({ error: true, message: 'User Login Another Device' });
          }
        }
        if(crewMember){
            const bookingCount = await bookingData.countDocuments({customerRef: decodedToken.customerRef ,__v:0,crewId:decodedToken.crewid});
            const crewCount = await leaveData.countDocuments({ customerRef: decodedToken.customerRef ,__v:0,crewid:decodedToken.crewid});
            const enquieryCount = await enquieryData.countDocuments({ customerRef: decodedToken.customerRef ,__v:0,crewId:decodedToken.crewid});
            const customerCount = await customerData.countDocuments({ customerRef: decodedToken.customerRef ,__v:0,crewId:decodedToken.crewid});
           console.log("crew leave ",crewCount)
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
        }
        //-------------------------- Use countDocuments() to get the count of documents------------

        const bookingCount = await bookingData.countDocuments({ customerRef: decodedToken.customerRef ,__v:0});
        const crewCount = await crewData.countDocuments({ customerRef: decodedToken.customerRef ,__v:0});
        const enquieryCount = await enquieryData.countDocuments({ customerRef: decodedToken.customerRef ,__v:0});
        const customerCount = await customerData.countDocuments({ customerRef: decodedToken.customerRef ,__v:0});
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
        const user = await User.findOne({customerRef: decodedToken.customerRef });
        const crewMember = await crewData.findOne({ customerRef: decodedToken.customerRef,crewid:decodedToken.crewid,__v:0});
        if (user.Jwttoken || crewMember.Jwttoken) {
            const userTokenMatch = token === user.Jwttoken;
            const crewTokenMatch = token === crewMember?.Jwttoken;
            if (!userTokenMatch && !crewTokenMatch) {
              return res.status(404).json({ error: true, message: 'User Login Another Device' });
            }
          }
          let totalBookingCount;
          let pendingCount;
          let successCount;
          let cancelCount;
          let deliverCount;

          if(crewMember){
             totalBookingCount = await bookingData.countDocuments({ customerRef: decodedToken.customerRef,__v:0,});
             pendingCount = await bookingData.countDocuments({ customerRef: decodedToken.customerRef, status: 'Pending',__v:0 ,crewId:decodedToken.crewid});
             successCount = await bookingData.countDocuments({ customerRef: decodedToken.customerRef, status: 'Success',__v:0 ,crewId:decodedToken.crewid});
             cancelCount = await bookingData.countDocuments({ customerRef: decodedToken.customerRef, status: 'Cancel',__v:0 ,crewId:decodedToken.crewid});
             deliverCount = await bookingData.countDocuments({ customerRef: decodedToken.customerRef, status: 'Deliver',__v:0,crewId:decodedToken.crewid });
            const lastBookingData = await bookingData
            .findOne({ customerRef: decodedToken.customerRef, __v: 0 })
            .sort({ _id: -1 });
            console.log("last booking",lastBookingData);
            return res.status(200).json({
                error: false,
                message: 'Booking status counts retrieved successfully',
                data: {
                    totalBookingCount,
                    pendingCount,
                    successCount,
                    cancelCount,
                    deliverCount,
                    lastBooking:lastBookingData
                }
            });
          }

        //--------------------------Admin Status Count Queries --------------------------
       
         totalBookingCount = await bookingData.countDocuments({ customerRef: decodedToken.customerRef,__v:0 });
         pendingCount = await bookingData.countDocuments({ customerRef: decodedToken.customerRef, status: 'Pending',__v:0 });
         successCount = await bookingData.countDocuments({ customerRef: decodedToken.customerRef, status: 'Success',__v:0 });
         cancelCount = await bookingData.countDocuments({ customerRef: decodedToken.customerRef, status: 'Cancel',__v:0 });
         deliverCount = await bookingData.countDocuments({ customerRef: decodedToken.customerRef, status: 'Deliver',__v:0 });
        
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
