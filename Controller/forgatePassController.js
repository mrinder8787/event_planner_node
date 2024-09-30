const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const registrionapi = require('../model/registrion');
const crewentry = require('../model/crewentry');
require('dotenv').config();

const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    let userFound = await registrionapi.findOne({ email });

    if (!userFound) {
      userFound = await crewentry.findOne({ crewEmail: email });
      console.log("userFound", userFound);
    }

    if (!userFound) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    if (!userFound.resetPasswordOTP || !userFound.resetPasswordOTPExpires) {
      userFound.resetPasswordOTP = otp;
      userFound.resetPasswordOTPExpires = otpExpires;
      await userFound.save();
    } else {
      console.log(`User ${email} already has a valid OTP or OTP expiration set.`);
    }

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Event Planner Team" <${process.env.EMAIL_USER}>`,
      to: "anshusingh87873@gmail.com",
      // to: userFound.email || userFound.crewEmail,
      subject: 'Event Planner: Password Reset Request',
      text: `Dear ${userFound.name || userFound.crewName},
  
  We received a request to reset your password for your Event Planner account. Please use the following One-Time Password (OTP) to reset your password:
  
  Your OTP: ${otp}
  
  This OTP is valid for the next 10 minutes. If you did not request a password reset, please ignore this email or contact our support team immediately.
  
  Best Regards,
  Event Planner Team
  
  Note: Do not share this OTP with anyone for security reasons.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error.message);
        return res.status(500).json({ error: true, message: 'Error sending email' });
      } else {
        console.log('Email sent: ' + info.response);
        return res.status(200).json({ error: false, message: 'Password reset OTP sent to email' });
      }
    });
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: true, message: 'Internal server error' });
  }
};

//--------------------------After send Otp Reset Password------------------------------------

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    let userFound = await registrionapi.findOne({ email });

    if (!userFound) {
      userFound = await crewentry.findOne({ crewEmail: email });
    }

    if (!userFound) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }

    const currentTime = new Date();
    if (userFound.resetPasswordOTP !== otp || currentTime > userFound.resetPasswordOTPExpires) {
      return res.status(400).json({ error: true, message: 'Invalid or expired OTP' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    if (userFound.password) {
      userFound.password = hashedNewPassword;
    } else {
      userFound.crewpassword = hashedNewPassword;
    }

    userFound.resetPasswordOTP = undefined;
    userFound.resetPasswordOTPExpires = undefined;
    await userFound.save();

    return res.status(200).json({ error: false, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: true, message: 'Internal server error' });
  }
};