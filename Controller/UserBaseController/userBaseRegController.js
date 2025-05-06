const userBase = require('../../model/UserModel/userBaseRegisration');
const userOtp = require('../../model/UserModel/userSaveOtpModel');
const ownerData = require("../../model/registrion");
const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000);
};

const generateUserId = () => {
    return `User_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
};




exports.genrateOTPUser = async (req, res) => {
    const { mobileNumber } = req.body;
    try {
        if (!mobileNumber) {
            return res.status(400).json({
                error: true,
                message: "Moblie Number Is requerd"
            })
        }
        const userExits = await userBase.findOne({ mobileNumber });
        const existingOtp = await userOtp.findOne({ mobileNumber });
        if (userExits) {
            const otp = generateOtp();
            console.log("exiting otp ", otp);
            if (existingOtp) {
                existingOtp.otp = otp;
                existingOtp.otpExpires = Date.now() + 10 * 60 * 1000;
                await existingOtp.save();
                return res.status(200).json({
                    error: false,
                    message: 'Welcome Login otp sent successfully',
                    data: existingOtp
                });
            }
            const newOtp = new userOtp({
                mobileNumber,
                otp,
                otpExpires: Date.now() + 10 * 60 * 1000
            });
            const userOtoData = await newOtp.save();
            return res.status(200).json({
                error: false,
                message: 'Login OTP sent successfully',
                data: userOtoData
            });
        }
        if (!userExits) {
            const otp = generateOtp();
            console.log("Not exiting otp ", otp);
            if (existingOtp) {
                existingOtp.otp = otp;
                existingOtp.otpExpires = Date.now() + 10 * 60 * 1000;
                await existingOtp.save();
                return res.status(200).json({
                    error: false,
                    message: 'Welcome otp sent successfully',
                    data: existingOtp
                });
            }
            const newOtp = new userOtp({
                mobileNumber,
                otp,
                otpExpires: Date.now() + 10 * 60 * 1000
            });
            const userOtoData = await newOtp.save();
            return res.status(200).json({
                error: false,
                message: 'OTP sent successfully',
                data: userOtoData
            });
        }

    } catch (error) {
        console.log("catch Error ", error.message);
    }
}


//==============================> OTP Verify <======================

exports.userVerifyOTPLogin = async (req, res) => {
    const { mobileNumber, otp } = req.body;
    try {
        if (!mobileNumber) {
            return res.status(400).json({
                error: true,
                message: "Moblie Number Is requerd"
            })
        }
        if (!mobileNumber) {
            return res.status(400).json({
                error: true,
                message: "Moblie Number Is requerd"
            })
        }
        if (!otp) {
            return res.status(400).json({
                error: true,
                message: "otp is requerd"
            })
        }
        const userExits = await userBase.findOne({ mobileNumber });
        const otpVerify = await userOtp.findOne({ mobileNumber });
        if (!otpVerify) {
            console.error('OTP not found');
            return res.status(400).json({
                error: true,
                message: 'Invalid or expired OTP',
            });
        }

        if (Date.now() > otpVerify.otpExpires) {
            console.error('OTP expired');
            return res.status(400).json({
                error: true,
                message: 'Invalid or expired OTP',
            });
        }

        if (otpVerify.otp !== otp) {
            console.error('OTP mismatch');
            return res.status(400).json({
                error: true,
                message: 'Invalid OTP, does not match',
            });
        }

        if (userExits) {
            const expiresIn = 24 * 60 * 60;
            const token = jwt.sign(
                { id: userExits._id, userId: userExits.userid },
                process.env.ACCESS_SECRET_TOKEN,
                { expiresIn: expiresIn }
            );
            userExits.Jwttoken = token;
            userExits.lastLogin = Date();
            await userExits.save();
            return res.status(200).json({
                error: false,
                message: 'Login successfully',
                data: userExits
            });
        }
        if (!userExits) {
            const userId = generateUserId();
            const newUser = new userBase({
                mobileNumber,
                userid: userId,
                lastLogin: Date()
            });
            const newUserData = await newUser.save();
            const expiresIn = 24 * 60 * 60;
            const token = jwt.sign(
                { id: newUserData._id, userId: newUserData.userid },
                process.env.ACCESS_SECRET_TOKEN,
                { expiresIn: expiresIn }
            );
            newUserData.Jwttoken = token;
            await newUserData.save();

            return res.status(200).json({
                error: false,
                message: 'Registrion successfully',
                data: newUserData
            });
        }

    } catch (error) {
        console.log("catch Error ", error.message);
        return res.status(500).json({
            error: true,
            message: error.message
        });
    }
}


//===========================> User Update Profile <================================


exports.userUpdateProfile = async (req, res) => {
    const authToken = req.headers.authorization;
    if (!authToken) {
        return res.status(401).json({ error: true, message: 'Unauthorized: Missing authorization token' });
    }
    try {
        const { name, email } = req.body;
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
        if (!user) {
            return res.status(404).json({ error: true, message: 'User not found' });
        }
        if (user.Jwttoken) {
            const userTokenMatch = token === user.Jwttoken;
            if (!userTokenMatch) {
                return res.status(404).json({ error: true, message: 'User Login Another Device' });
            }
        }
        if (user) {
            user.name = name;
            user.email = email;
            await user.save();
            return res.status(200).json({
                error: false,
                message: "Profile Update"
            });
        }
        return res.status(400).json({
            error: true,
            message: "Profile Not Update"
        });

    } catch (error) {
        console.log("catch Error ", error.message);
        return res.status(500).json({
            error: true,
            message: error.message
        });
    }
}



//===========================> User find Profile <================================


exports.userFindProfile = async (req, res) => {
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
        if (!user) {
            return res.status(404).json({ error: true, message: 'User not found' });
        }
        if (user.Jwttoken) {
            const userTokenMatch = token === user.Jwttoken;
            if (!userTokenMatch) {
                return res.status(404).json({ error: true, message: 'User Login Another Device' });
            }
        }
        if (user) {
            return res.status(200).json({
                error: true,
                message: "User find ",
                data: user
            });
        }


    } catch (error) {
        console.log("catch Error ", error.message);
        return res.status(500).json({
            error: true,
            message: error.message
        });
    }
}


//===========================> User find Profile Owner <================================

exports.userFindProfileOwner = async (req, res) => {
    const authToken = req.headers.authorization;
    const userId = req.params.userId;
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
        const owner = await ownerData.findOne({ customerRef: decodedToken.customerRef });

        if (owner.Jwttoken) {
            const userTokenMatch = token === owner.Jwttoken;
            if (!userTokenMatch) {
                return res.status(404).json({ error: true, message: 'User Login Another Device' });
            }
        }
        const user = await userBase.findOne({ userid: userId, });
        if (!user) {
            return res.status(404).json({ error: true, message: 'User not found' });
        }

        if (user) {
            return res.status(200).json({
                error: true,
                message: "User find ",
                data: user
            });
        }


    } catch (error) {
        console.log("catch Error ", error.message);
        return res.status(500).json({
            error: true,
            message: error.message
        });
    }
}