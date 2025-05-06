const bcrypt = require('bcrypt');
const registrionapi = require('../model/registrion');
const crewentry = require('../model/crewentry');
const {sendMail} = require('../Controller/mailController');
require('dotenv').config();

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
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
    userFound.resetPasswordOTP = undefined;
    userFound.resetPasswordOTPExpires = undefined;
    await userFound.save();
    
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    if (!userFound.resetPasswordOTP || !userFound.resetPasswordOTPExpires) {
      userFound.resetPasswordOTP = otp;
      userFound.resetPasswordOTPExpires = otpExpires;
      await userFound.save();
    } else {
      console.log(`User ${email} already has a valid OTP or OTP expiration set.`);
    }
    await sendMail(
      email,
      `🔐 Event Planner: Forgot Password OTP Verification`,
      `
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
          <div style="max-width: 600px; background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 15px rgba(0,0,0,0.1);">
            <h2 style="color: #1a73e8; text-align: center;">🔐 Event Planner: Forgot Password OTP Verification</h2>
            <p style="font-size: 16px; color: #555; text-align: center;">
              We received a request to reset your password. Please use the OTP below to proceed with the password reset process.
            </p>
            
            <div style="text-align: center; margin: 20px 0;">
              <span style="font-size: 30px; font-weight: bold; color: #ffffff; background-color: #1a73e8; padding: 15px 30px; border-radius: 5px; display: inline-block;">
                ${otp}
              </span>
            </div>
    
            <p style="font-size: 16px; color: #555; text-align: center;">
              🚀 Enter this OTP on the password reset page to change your password.
            </p>
    
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
    
            <p style="font-size: 14px; color: #888; text-align: center;">
              ❗ If you didn’t request this, please ignore this email. Your account is safe.
            </p>
    
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
    
            <p style="font-size: 16px; color: #555; text-align: center;">
              Thank you,<br>
              🌟 <strong>Event Planner Team</strong>
            </p>
          </div>
        </body>
      </html>
      `
    );
    console.error('Otp :',otp);
    return res.status(200).json({
      error:false,
      message:"Otp Send in your gmail",})
  
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: true, message: 'Internal server error' });
  }
};

//------------------------------Verify OTP --------------------------
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

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
    return res.status(200).json({ error: false, message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: true, message: 'Internal server error' });
  }
};

//--------------------------After send Otp Reset Password------------------------------------

exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    let userFound = await registrionapi.findOne({ email });

    if (!userFound) {
      userFound = await crewentry.findOne({ crewEmail: email });
    }

    if (!userFound) {
      return res.status(404).json({ error: true, message: 'User not found' });
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
