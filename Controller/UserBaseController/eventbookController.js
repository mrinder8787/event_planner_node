const jwt = require('jsonwebtoken');
const userBase = require('../../model/UserModel/userBaseRegisration');
const eventItemModel = require("../../model/UserModel/eventItemModel");
const bookEventModel = require("../../model/UserModel/bookEventOwner");
const adminUser = require('../../model/registrion');


exports.addBookEventOwner = async (req, res) => {
    const authToken = req.headers.authorization;
    if (!authToken) {
        return res.status(401).json({ error: true, message: 'Unauthorized: Missing authorization token' });
    }
    try {
        const { bookEvent } = req.body;

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
        const user = await adminUser.findOne({ customerRef: decodedToken.customerRef });

        if (user.Jwttoken) {
            const userTokenMatch = token === user.Jwttoken;
            if (!userTokenMatch) {
                return res.status(404).json({ error: true, message: 'User Login Another Device' });
            }
        }
        const adminBookEventifnd = await bookEventModel.findOne({ customerRef: decodedToken.customerRef });
        if (adminBookEventifnd) {
            return res.status(400).json({
                error: true,
                message: "Your Event Already Save Please Update"
            })
        }
        const newEventBook = await bookEventModel({
            bookEvent,
            customerRef: decodedToken.customerRef,
        });
        await newEventBook.save();

        return res.status(200).json({
            error: false,
            message: "Event Save Successfully !",
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
//=====================================Event Item Save ==========================================
exports.addEventItemOwner = async (req, res) => {
    const authToken = req.headers.authorization;
    if (!authToken) {
        return res.status(401).json({ error: true, message: 'Unauthorized: Missing authorization token' });
    }
    try {
        const { eventItem } = req.body;

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
        const user = await adminUser.findOne({ customerRef: decodedToken.customerRef });

        if (user.Jwttoken) {
            const userTokenMatch = token === user.Jwttoken;
            if (!userTokenMatch) {
                return res.status(404).json({ error: true, message: 'User Login Another Device' });
            }
        }
        const adminEventItemfind = await eventItemModel.findOne({ customerRef: decodedToken.customerRef });
        if (adminEventItemfind) {
            return res.status(400).json({
                error: true,
                message: "Your Item Already Save Please Update"
            })
        }
        const newEventBook = await eventItemModel({
            eventItem,
            customerRef: decodedToken.customerRef,
        });
        await newEventBook.save();

        return res.status(200).json({
            error: false,
            message: "Item Save Successfully !",
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

//===================================== Get Event Item Owner ==========================================

exports.getEventItemOwner = async (req, res) => {
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
        const user = await adminUser.findOne({ customerRef: decodedToken.customerRef });

        if (user.Jwttoken) {
            const userTokenMatch = token === user.Jwttoken;
            if (!userTokenMatch) {
                return res.status(404).json({ error: true, message: 'User Login Another Device' });
            }
        }
        const adminEventItemfind = await eventItemModel.findOne({ customerRef: decodedToken.customerRef });
        if (!adminEventItemfind) {
            return res.status(400).json({
                error: true,
                message: "Event Item Empty",
                data: adminEventItemfind
            })
        }

        return res.status(200).json({
            error: false,
            message: "Item Fetch Successfully !",
            data: adminEventItemfind
        })

    } catch (error) {
        console.log("Catch error", error.message);
        return res.status(500).json({
            error: true,
            message: error.message
        })
    }
}

//===================================== Get Event Owner ==========================================
exports.getBookEventOwner = async (req, res) => {
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
        const user = await adminUser.findOne({ customerRef: decodedToken.customerRef });

        if (user.Jwttoken) {
            const userTokenMatch = token === user.Jwttoken;
            if (!userTokenMatch) {
                return res.status(404).json({ error: true, message: 'User Login Another Device' });
            }
        }
        const adminBookEventfind = await bookEventModel.findOne({ customerRef: decodedToken.customerRef });
        if (!adminBookEventfind) {
            return res.status(400).json({
                error: true,
                message: "Event not found"
            })
        }
        return res.status(200).json({
            error: false,
            message: "Event fetch Successfully !",
            data: adminBookEventfind
        })

    } catch (error) {
        console.log("Catch error", error.message);
        return res.status(500).json({
            error: true,
            message: error.message
        })
    }
}



//===================================== Get Event Item User ==========================================

exports.getEventItemUser = async (req, res) => {
    const authToken = req.headers.authorization;
    const { customerRef } = req.params;
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
        if (!user) {
            return res.status(404).json({ error: true, message: 'User not found' });
        }
        if (user?.Jwttoken) {
            const userTokenMatch = token === user.Jwttoken;
            if (!userTokenMatch) {
                return res.status(404).json({ error: true, message: 'User logged in on another device' });
            }
        }
        const userEventItemfind = await eventItemModel.findOne({ customerRef });
        if (!userEventItemfind) {
            return res.status(400).json({
                error: true,
                message: "Event Item Empty",
                data: userEventItemfind
            })
        }

        return res.status(200).json({
            error: false,
            message: "Item Fetch Successfully !",
            data: userEventItemfind
        })

    } catch (error) {
        console.log("Catch error", error.message);
        return res.status(500).json({
            error: true,
            message: error.message
        })
    }
}

//===================================== Get Event User ==========================================
exports.getBookEventUser = async (req, res) => {
    const authToken = req.headers.authorization;
    const { customerRef } = req.params;
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
        if (!user) {
            return res.status(404).json({ error: true, message: 'User not found' });
        }
        if (user?.Jwttoken) {
            const userTokenMatch = token === user.Jwttoken;
            if (!userTokenMatch) {
                return res.status(404).json({ error: true, message: 'User logged in on another device' });
            }
        }
        const userBookEventfind = await bookEventModel.findOne({ customerRef});
        if (!userBookEventfind) {
            return res.status(400).json({
                error: true,
                message: "Event not found"
            })
        }
        return res.status(200).json({
            error: false,
            message: "Event fetch Successfully !",
            data: userBookEventfind
        })

    } catch (error) {
        console.log("Catch error", error.message);
        return res.status(500).json({
            error: true,
            message: error.message
        })
    }
}