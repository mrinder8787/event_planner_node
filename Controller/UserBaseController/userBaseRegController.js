const userBase = require('../../model/UserModel/userBaseRegisration');
const userOtp = require('../../model/UserModel/userSaveOtpModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000);
};

const generateUserId = () => {
    return `User_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  };
  
  console.log(generateUserId());
  

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


//============================== OTP Verify ======================

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
                { id: userExits._id,userId:userExits.userid},
                process.env.ACCESS_SECRET_TOKEN,
                { expiresIn:expiresIn }
              );
              userExits.Jwttoken=token;
              userExits.lastLogin=Date();
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
                userid:userId,
                lastLogin: Date()
            });
            const newUserData = await newUser.save();
            const expiresIn = 24 * 60 * 60;
            const token = jwt.sign(
                { id: newUserData._id,userId:newUserData.userid},
                process.env.ACCESS_SECRET_TOKEN,
                { expiresIn:expiresIn }
              );
              newUserData.Jwttoken=token;
              await newUserData.save();

            return res.status(200).json({
                error: false,
                message: 'Registrion successfully',
                data: newUserData
            });
        }

    } catch (error) {
        console.log("catch Error ", error.message);
    }
}