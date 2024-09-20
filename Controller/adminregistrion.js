const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const registrionapi = require('../model/registrion');
const sendMail = require('../Controller/mailController');

const generateCustomerRef = () => {
    return 'CUST-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.registraionApi = async (req, res) => {
    const { email, password, otp } = req.body;
    try {
        const existingUser = await registrionapi.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                error: true,
                message: 'User already exists',
            });
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const customerRefNo = generateCustomerRef();

            if(!otp){
                return res.status(400).json({
                    error: true,
                    message: 'Otp field are requerd',
                });
            }
            const newUser = new registrionapi({
                email,
                password: hashedPassword,
                customerRef: customerRefNo,
                otp,
            });

            const registrationData = await newUser.save();


            return res.status(200).json({
                error: false,
                msg: 'Register User Successfully! OTP has been sent to your email.',
                data: registrationData,
            });
        }
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errorMessage = Object.values(error.errors)
                .map(error => error.message)
                .join(', ');

            console.log('Validation Error:', errorMessage);

            return res.status(400).json({
                error: true,
                message: errorMessage,
            });
        } else {
            console.log('Error:', error);

            return res.status(400).json({
                error: true,
                message: 'Enter valid fields!',
            });
        }
    }
};




exports.adminSendRegistrionMail = async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) {
            return res.status(400).json({ error: 'Email id are required.' });
        }
        const otp = generateOTP();
        await sendMail(email, 'Event Planner: Registration OTP Verification', `Dear User,

Thank you for registering with Event Planner. To complete your registration, please use the OTP (One-Time Password) provided below:

Your OTP code is: [${otp}]

Please enter this OTP in the provided field on the registration page to verify your email address and complete your registration process.

If you didn't request this OTP, please ignore this email.

Thank you,

Event Planner Team
`);
        return res.status(200).json({
            error: false,
            message: `OTP Sent Your Mail`,
            otp: otp
        })
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: err.message

        })
    }
}