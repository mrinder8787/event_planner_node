const jwt = require('jsonwebtoken');
const userEventBook = require("../../model/UserModel/userBookEventModel");
const ownerData = require("../../model/registrion");
const userBase = require('../../model/UserModel/userBaseRegisration');
const businessDetails = require("../../model/bussinessaddModel");
const addUserAddress = require("../../model/UserModel/userAddressModel");


exports.bookEventUser = async (req, res) => {
    const authToken = req.headers.authorization;
    if (!authToken) {
        return res.status(401).json({ error: true, message: 'Unauthorized: Missing authorization token' });
    }
    try {
        const { bussinessId, customerRef, pinCode, state, city, userOfferAmount,
            ownerAmount, bookingitem, bookingEvent, eventDate, eventToDate, fullAddress } = req.body;
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
        const businessData = await businessDetails.findOne({ customerRef: customerRef, _id: bussinessId })
        const newEventBook = await userEventBook({
            bussinessId,
            bussinessName: businessData.BussinessName,
            bussinessLogo: businessData.imageUrl,
            customerRef,
            userId: decodedToken.userId,
            pinCode,
            state,
            city,
            fullAddress,
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

//-----------------------------------------> Book By owner <----------------------------------
exports.bookEventbyOwnerforUser = async (req, res) => {
    const authToken = req.headers.authorization;
    if (!authToken) {
        return res.status(401).json({ error: true, message: 'Unauthorized: Missing authorization token' });
    }
    try {
        const { userEmail, mobileNumber, userName, userId, pinCode, state, city, userOfferAmount,
            ownerAmount, bookingitem, bookingEvent, eventDate, eventToDate, fullAddress, altMobileNumber } = req.body;
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
        const businessData = await businessDetails.findOne({ customerRef: decodedToken.customerRef });
        const getAddress = await addUserAddress.findOne({ userId, defaultAddress: true });
        const findUser = await userBase.findOne({ userid: userId })
        const newEventBook = await userEventBook({
            bussinessId: businessData._id,
            bussinessName: businessData.BussinessName,
            bussinessLogo: businessData.imageUrl,
            customerRef: decodedToken.customerRef,
            userId: userId,
            pinCode,
            state,
            city,
            fullAddress,
            userOfferAmount,
            ownerAmount,
            bookingitem,
            bookingEvent,
            eventDate,
            eventToDate,
            status: "Book by Owner",
            altMobileNumber
        });

        if (!getAddress) {
            const addAddress = await addUserAddress({
                userId,
                name: userName,
                mobileNumber,
                Address1: fullAddress,
                state,
                city,
                pinCode,
                defaultAddress: true
            });
            await addAddress.save();
            console.log("User address By owner",addAddress);
        }
        if (!findUser.name || findUser.email) {
            findUser.name = userName;
            findUser.email = userEmail;
            await findUser.save();
            console.log("User Profile Update By owner",findUser);
        }

        await newEventBook.save();
        return res.status(200).json({
            error: false,
            message: "Data Send Successfully !",
            data: newEventBook
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

        if (!decodedToken || !decodedToken.id || !decodedToken.userId) {
            return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
        }

        const user = await userBase.findOne({ userid: decodedToken.userId, _id: decodedToken.id });

        if (user?.Jwttoken && token !== user.Jwttoken) {
            return res.status(404).json({ error: true, message: 'User Login Another Device' });
        }

        // Pagination setup
        let page = parseInt(req.query.page) || 1;
        let limit = 10;
        let skip = (page - 1) * limit;

        const totalRecords = await userEventBook.countDocuments({ userId: decodedToken.userId });
        const userEventList = await userEventBook.find({ userId: decodedToken.userId })
            .skip(skip)
            .limit(limit)
            .lean();

        return res.status(200).json({
            error: false,
            message: userEventList.length ? "Event Find Successfully!" : "Event not found",
            data: userEventList,
            totalRecords,
            totalPages: Math.ceil(totalRecords / limit),
            currentPage: page
        });

    } catch (error) {
        console.log("Catch error", error.message);
        return res.status(500).json({
            error: true,
            message: error.message
        });
    }
};

//-------------------> Get Owner all event Request List <-------------------------------------
exports.getOwnerEventList = async (req, res) => {
    const authToken = req.headers.authorization;
    if (!authToken) {
        return res.status(401).json({ error: true, message: 'Unauthorized: Missing authorization token' });
    }

    try {
        const token = authToken.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);

        if (!decodedToken || !decodedToken.customerRef || !decodedToken.userId) {
            return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
        }

        const owner = await ownerData.findOne({ customerRef: decodedToken.customerRef });

        if (owner?.Jwttoken && token !== owner.Jwttoken) {
            return res.status(404).json({ error: true, message: 'User Login Another Device' });
        }

        // Pagination setup
        let page = parseInt(req.query.page) || 1;
        let limit = 10;
        let skip = (page - 1) * limit;

        const totalRecords = await userEventBook.countDocuments({ customerRef: decodedToken.customerRef });
        const userEventfind = await userEventBook.find({
            customerRef: decodedToken.customerRef,
            status: { $ne: "Book by Owner" } // Exclude items with status "Book by Owner"
        })
            .skip(skip)
            .limit(limit)
            .lean();
        

        return res.status(200).json({
            error: false,
            message: userEventfind.length ? "Event Find Successfully!" : "Event not found",
            data: userEventfind,
            totalRecords,
            totalPages: Math.ceil(totalRecords / limit),
            currentPage: page
        });

    } catch (error) {
        console.log("Catch error", error.message);
        return res.status(500).json({
            error: true,
            message: error.message
        });
    }
};

exports.ownerUpdateEvent = async (req, res) => {
    const authToken = req.headers.authorization;
    if (!authToken) {
        return res.status(401).json({ error: true, message: 'Unauthorized: Missing authorization token' });
    }
    try {
        const { ownerAmount, status, _id, rejectReason } = req.body;
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
        const userEventfind = await userEventBook.findOne({ _id, customerRef: decodedToken.customerRef });
        if (userEventfind && !rejectReason) {
            userEventfind.status = status,
                userEventfind.ownerAmount = ownerAmount,
                await userEventfind.save();
            return res.status(200).json({
                error: false,
                message: "Status update Successfully !"
            })
        }
        if (userEventfind && rejectReason) {
            userEventfind.status = status,
                userEventfind.ownerAmount = ownerAmount,
                userEventfind.rejectReason = rejectReason,
                await userEventfind.save();
            return res.status(200).json({
                error: false,
                message: "Rejected Successfully !"
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
