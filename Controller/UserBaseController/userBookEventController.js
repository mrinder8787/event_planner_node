const jwt = require('jsonwebtoken');
const userEventBook = require("../../model/UserModel/userBookEventModel");
const ownerData = require("../../model/registrion");
const userBase = require('../../model/UserModel/userBaseRegisration');




exports.bookEventUser = async (req, res) => {
    const authToken = req.headers.authorization;
    if (!authToken) {
        return res.status(401).json({ error: true, message: 'Unauthorized: Missing authorization token' });
    }
    try {
        const { bussinessId, customerRef, pinCode, state, city, userOfferAmount,
            ownerAmount, bookingitem, bookingEvent, eventDate, eventToDate } = req.body;
        const token = authToken.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
        if (!decodedToken) {
            return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
        }

        if (!decodedToken.id) {

            return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
        }

        if (!decodedToken.userId) {

            return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
        }
        const user = await userBase.findOne({ userid: decodedToken.userId, _id: decodedToken.id });

        if (user.Jwttoken) {
            const userTokenMatch = token === user.Jwttoken;
            if (!userTokenMatch) {
                return res.status(404).json({ error: true, message: 'User Login Another Device' });
            }
        }
        const userEventfind = await userEventBook.findOne({ bussinessId, userId: decodedToken.userId });
        if (userEventfind) {
            if (userEventfind.status === "Request Send" && userEventfind.customerRef === customerRef) {
                return res.status(400).json({
                    error: true,
                    message: "Your Requset Already Send"
                })
            }
        }
        const newEventBook = await userEventBook({
            bussinessId,
            customerRef,
            userId: decodedToken.userId,
            pinCode,
            state,
            city,
            userOfferAmount,
            ownerAmount,
            bookingitem,
            bookingEvent,
            eventDate,
            eventToDate
        });
        await newEventBook.save();

        return res.status(200).json({
            error: false,
            message: "Request Send Successfully !"
        })

    } catch (error) {
        console.log("Catch error", error.message);
        return res.status(500).json({
            error: true,
            message: error.message
        })
    }
}


//---------------------------------Get Event List ================================

exports.getUserEventList = async (req, res) => {
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

        if (!decodedToken.id) {

            return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
        }

        if (!decodedToken.userId) {

            return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
        }
        const user = await userBase.findOne({ userid: decodedToken.userId, _id: decodedToken.id });

        if (user.Jwttoken) {
            const userTokenMatch = token === user.Jwttoken;
            if (!userTokenMatch) {
                return res.status(404).json({ error: true, message: 'User Login Another Device' });
            }
        }
        const userEventList = await userEventBook.find({ userId: decodedToken.userId });
        if (userEventList) {
            return res.status(200).json({
                error: false,
                message: "Event Find Successfully !",
                data: userEventList
            });
        }
        return res.status(400).json({
            error: false,
            message: "Bussiness not find",
            data: userEventList
        });

    } catch (error) {
        console.log("Catch error", error.message);
        return res.status(500).json({
            error: true,
            message: error.message
        })
    }
}

exports.ownerUpdateEvent = async (req, res) => {
    const authToken = req.headers.authorization;
    if (!authToken) {
        return res.status(401).json({ error: true, message: 'Unauthorized: Missing authorization token' });
    }
    try {
        const { ownerAmount, status,_id} = req.body;
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
        const owner = await ownerData.findOne({ customerRef: decodedToken.customerRef });

        if (owner.Jwttoken) {
            const userTokenMatch = token === owner.Jwttoken;
            if (!userTokenMatch) {
                return res.status(404).json({ error: true, message: 'User Login Another Device' });
            }
        }
        const userEventfind = await userEventBook.findOne({_id,customerRef: decodedToken.customerRef});
        if (userEventfind) {
            userEventfind.status=status,
            userEventfind.ownerAmount=ownerAmount,
            await userEventfind.save();
            return res.status(200).json({
                error: false,
                message: "Status update Successfully !"
            })
        }
    
        return res.status(200).json({
            error: false,
            message: "Event not find"
        })

    } catch (error) {
        console.log("Catch error", error.message);
        return res.status(500).json({
            error: true,
            message: error.message
        })
    }
}
