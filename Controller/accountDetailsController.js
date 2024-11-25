const account = require('../model/accountDetailsmodel');
const jwt = require('jsonwebtoken');
const User = require('../model/registrion');
require('dotenv').config();


exports.accountDetails = async (req, res) => {
    const authToken = req.headers.authorization;
    const { accountHolderName, accountNumber, ifscCode, branchName, bankName } = req.body;
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
        const user = await User.findOne({ customerRef: decodedToken.customerRef });

        if (user.Jwttoken) {
            const userTokenMatch = token === user.Jwttoken;
            if (!userTokenMatch) {
                return res.status(404).json({ error: true, message: 'User Login Another Device' });
            }
        }
        const Account = await account.findOne({ customerRef: decodedToken.customerRef });
        if (Account) {
            return res.status(401).json({
                error: true,
                message: "Account Details Already Save"
            })
        }

        const accountDetails = account({
            accountHolderName,
            accountNumber,
            ifscCode,
            branchName,
            bankName,
            customerRef: decodedToken.customerRef
        });

        const accountData = await accountDetails.save();
        return res.status(200).json({
            error: false,
            message: "Account Details Save Successfully",
            data: accountData
        })


    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message
        })
    }
}
