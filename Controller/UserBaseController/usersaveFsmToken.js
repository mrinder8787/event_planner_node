const jwt = require('jsonwebtoken');
require('dotenv').config();
const userbase = require('../../model/UserModel/userBaseRegisration');
const usersaveFcmtoken = require('../../model/UserModel/userfcmtoken');
const ownerData = require("../../model/registrion");

exports.saveuserFcmToken = async (req, res) => {
    const authToken = req.headers.authorization;
    if (!authToken) {
        return res.status(401).json({ error: true, message: 'Unauthorized: Missing authorization token' });
    }

    try {
        const { fcmToken } = req.body;
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
        const user = await userbase.findOne({ userid: decodedToken.userId, _id: decodedToken.id });

        if (user.Jwttoken) {
            const userTokenMatch = token === user.Jwttoken;
            if (!userTokenMatch) {
                return res.status(404).json({ error: true, message: 'User Login Another Device' });
            }
        }

        const findFcmToken = await usersaveFcmtoken.findOne({ userid: decodedToken.userId });
        if (findFcmToken) {
            findFcmToken.fcmToken = fcmToken;
            await findFcmToken.save();
            console.log("User Fcm Token Update ", findFcmToken);
            return res.status(200).json({ error: false, message: 'FSM Token Updated Successfully!', data: findFcmToken });
        }

        const fsmTokensave = usersaveFcmtoken({
            fcmToken,
            userid: decodedToken.userId
        });
        await fsmTokensave.save();
        console.log("User Fcm Token Update ", fsmTokensave);
        return res.status(200).json({ error: false, message: 'FSM Token Save Succeessfully!', data: [fsmTokensave] });

    } catch (error) {
        console.log("Catch error", error.message);
        return res.status(500).json({
            error: true,
            message: error.message
        });
    }
}



//------------------------------ Get Fcm Token User --------------------------

exports.getuserFcmToken = async (req, res) => {
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
        const user = await userbase.findOne({ userid: decodedToken.userId, _id: decodedToken.id });
        if (!user) {
            return res.status(404).json({ error: true, message: 'User not found' });
        }

        if (user.Jwttoken) {
            const userTokenMatch = token === user.Jwttoken;
            if (!userTokenMatch) {
                return res.status(404).json({ error: true, message: 'User Login Another Device' });
            }
        }

        const findFcmToken = await usersaveFcmtoken.findOne({ userid: decodedToken.userId });
        if (findFcmToken) {
            console.log("Get User Fcm Token ", findFcmToken);
            return res.status(200).json({ error: false, message: 'FcmToken fetch Successfully!', data: findFcmToken });
        }
        return res.status(200).json({ error: false, message: 'FcmToken not found', });

    } catch (error) {
        console.log("Catch error", error.message);
        return res.status(500).json({
            error: true,
            message: error.message
        });
    }
}

exports.getuserFcmTokenOwner = async (req, res) => {
    const authToken = req.headers.authorization;
    if (!authToken) {
        return res.status(401).json({ error: true, message: 'Unauthorized: Missing authorization token' });
    }

    try {
        const userId = req.params.userId
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

        const findFcmToken = await usersaveFcmtoken.findOne({ userid:userId });
        if (findFcmToken) {
            console.log("Get User Fcm Token ", findFcmToken);
            return res.status(200).json({ error: false, message: 'FcmToken fetch Successfully!', data: findFcmToken });
        }
        return res.status(200).json({ error: false, message: 'FcmToken not found', });

    } catch (error) {
        console.log("Catch error", error.message);
        return res.status(500).json({
            error: true,
            message: error.message
        });
    }
}