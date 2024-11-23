const leaveRequest = require('../model/leaveRequestCrewModel');
const jwt = require('jsonwebtoken');
const User = require('../model/registrion');
const Crew = require('../model/crewentry');
require('dotenv').config();


exports.leaveRequestCrew = async (req, res) => {
    const authToken = req.headers.authorization;
    const { reason, fromDate, toDate } = req.body;
    if (!authToken) {
        return res.status(401).json({ error: true, message: 'Unauthorized' });
    }
    try {
        const token = authToken.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
        console.log("decoded token", decodedToken);
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
        const crew = await Crew.findOne({ customerRef: decodedToken.customerRef, crewid: decodedToken.crewid });
        if (user.Jwttoken || crew.jwttoken) {
            const userTokenMatch = token === user.Jwttoken;
            const crewTokenMatch = token === crew.Jwttoken;
            if (!userTokenMatch && !crewTokenMatch) {
                return res.status(404).json({ error: true, message: 'Login Another Device' });
            }
        }
        const newRequst = leaveRequest({
            reason,
            fromDate,
            toDate,
            customerRef: decodedToken.customerRef,
            crewid: decodedToken.crewid
        });

        const saveData = await newRequst.save();
        return res.status(200).json({
            error: false,
            message: "Requset Send Successfully !",
            data: saveData,
        })

    } catch (error) {
        console.log("Server Error", error.message);
        return res.status(500).json({
            error: true,
            message: error.message
        })
    }

}


//---------------------------- Uapdate Status Requset Api ----------------------------------------

exports.leaveStatusUpadte = async (req, res) => {
    const authToken = req.headers.authorization;
    const { _id, status } = req.body;
    if (!authToken) {
        return res.status(401).json({ error: true, message: 'Unauthorized' });
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
        const crew = await Crew.findOne({ customerRef: decodedToken.customerRef, crewid: decodedToken.crewid });
        if (user.Jwttoken || crew.jwttoken) {
            const userTokenMatch = token === user.Jwttoken;
            const crewTokenMatch = token === crew.Jwttoken;
            if (!userTokenMatch && !crewTokenMatch) {
                return res.status(404).json({ error: true, message: 'Login Another Device' });
            }
        }

        const requestFind = await leaveRequest.findOne({ _id });
        if (requestFind) {
            requestFind.status = status;
            await requestFind.save();
            return res.status(200).json({
                error: false,
                message: "Requset Upadte Successfully !",
                data: requestFind,
            })

        }

    } catch (error) {
        console.log("Server Error", error.message);
        return res.status(500).json({
            error: true,
            message: error.message
        })
    }

}



//------------------------------------ Get  Api ---------------------------


exports.getAllrequest = async (req, res) => {
    const authToken = req.headers.authorization;
    try {
        if (!authToken) {
            return res.status(401).json({ error: true, message: 'Unauthorized' });
        }
        const token = authToken.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
        console.log("decoded token", decodedToken);
        if (!decodedToken) {
            return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
        }

        if (!decodedToken.customerRef) {
            return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
        }

        if (!decodedToken.userId) {
            return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
        }
        const user = await User.findOne({ customerRef: decodedToken.customerRef, _id: decodedToken.userId });
        const crew = await Crew.findOne({ customerRef: decodedToken.customerRef, crewid: decodedToken.crewid, _id: decodedToken.userId });
        if (user.Jwttoken || crew.jwttoken) {
            const userTokenMatch = token === user.Jwttoken;
            const crewTokenMatch = token === crew.Jwttoken;
            if (!userTokenMatch || crewTokenMatch) {
                return res.status(404).json({ error: true, message: 'Login Another Device' });
            }
        }

        if (user) {
            const requstlist = await leaveRequest.find({ customerRef: decodedToken.customerRef });
            return res.status(200).json({
                error: false,
                message: 'All request fetch',
                data: requstlist
            });
        }
        if (crew) {
            const crewrequstlist = await leaveRequest.find({ customerRef: decodedToken.customerRef, crewid: decodedToken.crewid });
            return res.status(200).json({
                error: false,
                message: 'All request fetch',
                data: crewrequstlist,
            });
        }




    } catch (error) {
        console.log('server Error', error.message);
        return res.status(500).json({
            error: true,
            message: error.message
        })
    }
}