const crewResignModel = require('../model/crewResignation');
const crewMember = require('../model/crewentry');
const jwt = require('jsonwebtoken');
const User = require('../model/registrion');
require('dotenv').config();



exports.crewResignation = async (req, res) => {
    const authToken = req.headers.authorization;
    const { reason, additionalComment } = req.body;
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

        const crew = await crewMember.findOne({ customerRef: decodedToken.customerRef, crewid: decodedToken.crewid });
        if (crew.Jwttoken) {
            const crewTokenMatch = token === crew.Jwttoken;
            if (!crewTokenMatch) {
                return res.status(404).json({ error: true, message: 'Login Another Device' });
            }
        }

        const crewresign = crewResignModel({
            CustomerRef: decodedToken.customerRef,
            CrewId: decodedToken.crewid,
            crewName: crew.crewName,
            reason,
            additionalComment,
        });

        await crewresign.save();
        return res.status(200).json({
            error: false,
            message: "Your Request Send Successfull",
            data: crewresign
        })
    } catch (e) {
        console.log("catch error", e.message);
        return res.status(500).json({
            error: true,
            message: e.message
        })
    }

}

//-----------------------Crew Resign Update ---------------------

exports.updateCrewResignation = async (req, res) => {
    const authToken = req.headers.authorization;
    const { resignationId } = req.params;
    const { status, crewFreeDate } = req.body;

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
        if (user.Jwttoken) {
            const userTokenMatch = token === user.Jwttoken;

            if (!userTokenMatch) {
                return res.status(404).json({ error: true, message: 'Login Another Device' });
            }
        }
        console.log("post Token", resignationId);
        const crewResign = await crewResignModel.findOne({
            _id: resignationId
        });

        if (!crewResign) {
            return res.status(404).json({
                error: true,
                message: 'Resignation record not found',
            });
        }

        if (status) crewResign.status = status;
        if (crewFreeDate) crewResign.crewFreeDate = crewFreeDate;
        await crewResign.save();

        return res.status(200).json({
            error: false,
            message: 'Resignation updated successfully',
            data: crewResign,
        });
    } catch (e) {
        console.log("catch error", e.message);
        return res.status(500).json({
            error: true,
            message: e.message,
        });
    }
};


//--------------------------  crew Get Resign Api -----------=

exports.getResignData = async (req, res) => {
    const authToken = req.headers.authorization;
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
        const crew = await crewMember.findOne({ customerRef: decodedToken.customerRef, crewid: decodedToken.crewid });
        if (user.Jwttoken || crew.Jwttoken) {
            const userTokenMatch = token === user.Jwttoken;
            const crewTokenMatch = token === crew?.Jwttoken;
            if (!userTokenMatch && !crewTokenMatch) {
                return res.status(404).json({ error: true, message: 'Login Another Device' });
            }
        }
        if (crew) {
            const crewResign = await crewResignModel.find({
                CrewId: decodedToken.crewid, CustomerRef: decodedToken.customerRef
            });
            return res.status(200).json({
                error: false,
                message: "Resign Fetch Successfully",
                data: crewResign
            })
        }
        const crewResign = await crewResignModel.find({ CustomerRef: decodedToken.customerRef });
        return res.status(200).json({
            error: false,
            message: "Admin Resign Fetch Successfully",
            data: crewResign
        })



    } catch (error) {
        console.log("catch error", error.message);
        return res.status(500).json({
            error: true,
            message: error.message
        })
    }
}