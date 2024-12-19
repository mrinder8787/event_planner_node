const userAddress = require("../../model/UserModel/userAddressModel");
const jwt = require('jsonwebtoken');
const userBase = require('../../model/UserModel/userBaseRegisration');
const userDeleteAddress = require('../../model/UserModel/userAddressDeleteModel');


require('dotenv').config();


exports.addUserAddress = async (req, res) => {
    const authToken = req.headers.authorization;
    if (!authToken) {
        return res.status(401).json({ error: true, message: 'Unauthorized: Missing authorization token' });
    }

    try {
        const { name, mobileNumber, Address1, state, city, pinCode, defaultAddress } = req.body;

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
        if (defaultAddress === true) {
            await userAddress.updateMany(
                { userId: decodedToken.userId, defaultAddress: true },
                { $set: { defaultAddress: false } }
            );
        }
        const newAddress = new userAddress({
            userId: decodedToken.userId,
            name,
            mobileNumber,
            Address1,
            state,
            city,
            pinCode,
            defaultAddress: !!defaultAddress
        });

        await newAddress.save();

        return res.status(200).json({
            error: false,
            message: "Address added successfully!",
            data: newAddress
        });

    } catch (error) {
        console.log("Catch error", error.message);
        return res.status(500).json({
            error: true,
            message: error.message
        });
    }
};

//==========================================Address Update ===================================
exports.updateUserAddress = async (req, res) => {
    const authToken = req.headers.authorization;
    if (!authToken) {
        return res.status(401).json({ error: true, message: 'Unauthorized: Missing authorization token' });
    }

    try {
        const { addressId, name, mobileNumber, Address1, state, city, pinCode, defaultAddress } = req.body;

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
        const existingAddress = await userAddress.findOne({ _id: addressId, userId: decodedToken.userId });
        if (!existingAddress) {
            return res.status(404).json({ error: true, message: "Address not found" });
        }
        if (defaultAddress === true) {
            await userAddress.updateMany(
                { userId: decodedToken.userId, defaultAddress: true },
                { $set: { defaultAddress: false } }
            );
        }
        const updatedAddress = await userAddress.findByIdAndUpdate(
            addressId,
            {
                $set: {
                    name,
                    mobileNumber,
                    Address1,
                    state,
                    city,
                    pinCode,
                    defaultAddress: !!defaultAddress
                }
            },
            { new: true }
        );

        return res.status(200).json({
            error: false,
            message: "Address updated successfully!",
            data: updatedAddress
        });

    } catch (error) {
        console.log("Catch error", error.message);
        return res.status(500).json({
            error: true,
            message: error.message
        });
    }
};


//======================================Get All Address User =============================

exports.getUserAddress = async (req, res) => {
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
        if (!user) {
            return res.status(404).json({ error: true, message: 'User not found' });
        }
        if (user?.Jwttoken) {
            const userTokenMatch = token === user.Jwttoken;
            if (!userTokenMatch) {
                return res.status(404).json({ error: true, message: 'User logged in on another device' });
            }
        }

        const getAddress = await userAddress.find({ userId: decodedToken.userId });
        return res.status(200).json({
            error: false,
            message: "Address Fetch Successfully !",
            data: getAddress
        })

    } catch (error) {
        console.log("Catch error", error.message);
        return res.status(500).json({
            error: true,
            message: error.message
        })
    }
}


///============================= User Delete Address =========================================

exports.userAddressDelete = async (req, res) => {
    const authToken = req.headers.authorization;
    const { _id } = req.params;
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

        const addressDelete = await userAddress.findById(_id);

        if (!addressDelete) {
            return res.status(404).json({
                error: true,
                message: "Address not found "
            });
        }


        const deletedUserAddress = new userDeleteAddress(addressDelete.toObject());
        await deletedUserAddress.save();
        await userAddress.findByIdAndDelete(_id);
        return res.status(200).json({
            error: false,
            message: "Address delete successfully."
        });
    } catch (error) {
        console.log("Catch error", error.message);
        return res.status(500).json({
            error: true,
            message: error.message
        });
    }

}


//======================================Get Default Address User =============================

exports.getUserDefaultAddress = async (req, res) => {
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
        if (!user) {
            return res.status(404).json({ error: true, message: 'User not found' });
        }
        if (user?.Jwttoken) {
            const userTokenMatch = token === user.Jwttoken;
            if (!userTokenMatch) {
                return res.status(404).json({ error: true, message: 'User logged in on another device' });
            }
        }

        const getDefaultAddress = await userAddress.findOne({userId: decodedToken.userId,defaultAddress:true});
        if(!getDefaultAddress){
            return res.status(400).json({
                error: false,
                message: "Not Default address Save",
                data: []
            })
        }
        return res.status(200).json({
            error: false,
            message: "Address Fetch Successfully !",
            data: getDefaultAddress
        })

    } catch (error) {
        console.log("Catch error", error.message);
        return res.status(500).json({
            error: true,
            message: error.message
        })
    }
}
