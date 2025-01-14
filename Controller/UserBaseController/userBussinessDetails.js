const addBussiness = require('../../model/bussinessaddModel');
const userBase = require('../../model/UserModel/userBaseRegisration');
const jwt = require('jsonwebtoken');



exports.getBussinessByid = async (req, res) => {
    const authToken = req.headers.authorization;
    const _id = req.params._id
    if (!authToken) {
        return res.status(401).json({ error: true, message: 'Unauthorized: Missing authorization token' });
    }
    try {
        console.log("Token ",authToken);
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
        const businessFind = await addBussiness.findById(_id);
        if (businessFind) {
            return res.status(200).json({
                error: false,
                message: "Bussiness Find Successfully !",
                data: businessFind
            });
        }
        return res.status(400).json({
            error: false,
            message: "Bussiness not find",
            data: businessFind
        });

    } catch (error) {
        console.log("Catch error", error.message);
        return res.status(500).json({
            error: true,
            message: error.message
        })
    }
}

//===================== Get Bussiness by City ======================

exports.getBussinessByCity = async (req, res) => {
    const authToken = req.headers.authorization;
    const city = req.params.city
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
        const businessFind= await addBussiness.find({city});
        console.log("bussiness data",businessFind);
        if (businessFind.length > 0) {
            return res.status(200).json({
                error: false,
                message: "Bussiness fetched successfully!",
                data: businessFind,
            });
        } else {
            const allBussinessFind = await addBussiness.find();
            if (allBussinessFind.length > 0) {
                return res.status(200).json({
                    error: true,
                    message: "All Bussiness find",
                    data: allBussinessFind,
                });
            } else {
                return res.status(400).json({
                    error: true,
                    message: "Bussiness not find",
                    data: [],
                });
            }
        }
       

    } catch (error) {
        console.log("Catch error", error.message);
        return res.status(500).json({
            error: true,
            message: error.message
        })
    }
}

//=================================== Multiple Ids fetch data =================

exports.getBussinessByIds = async (req, res) => {
    const authToken = req.headers.authorization;
    const { ids, customerRef } = req.body;  
    
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

        if (user?.Jwttoken) {
            const userTokenMatch = token === user.Jwttoken;
            if (!userTokenMatch) {
                return res.status(404).json({ error: true, message: 'User logged in on another device' });
            }
        }
        const query = { _id: { $in: ids } };
        if (Array.isArray(customerRef) && customerRef.length > 0) {
            query.customerRef = { $in: customerRef };  
        }

        const businessFind = await addBussiness.find(query);

        if (businessFind.length > 0) {
            return res.status(200).json({
                error: false,
                message: "Businesses found successfully!",
                data: businessFind
            });
        }

        return res.status(200).json({
            error: false,
            message: "No businesses found.",
            data: []
        });

    } catch (error) {
        console.log("Catch error", error.message);
        return res.status(500).json({
            error: true,
            message: error.message
        });
    }
};

