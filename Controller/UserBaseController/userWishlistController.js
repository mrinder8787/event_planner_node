const userBase = require('../../model/UserModel/userBaseRegisration');
const userWishlist = require("../../model/UserModel/userWishlistModel");
const jwt = require('jsonwebtoken');



exports.addWishlist = async (req, res) => {
    const authToken = req.headers.authorization;
    if (!authToken) {
        return res.status(401).json({ error: true, message: 'Unauthorized: Missing authorization token' });
    }
    try {
        const { bussinessId, customerRef } = req.body;
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
        const wishlistFind = await userWishlist.findOne({ bussinessId });
        if (wishlistFind) {
            return res.status(400).json({
                error: true,
                message: "Already Add Wishlist this"
            })
        }
        const newWishlistAdd = await userWishlist({
            bussinessId,
            customerRef,
            userId: decodedToken.userId
        });

        await newWishlistAdd.save();

        return res.status(200).json({
            error: false,
            message: "Wishlist Add Successfully !"
        })

    } catch (error) {
        console.log("Catch error", error.message);
        return res.status(500).json({
            error: true,
            message: error.message
        })
    }
}



//==================================Get Wish List User =========================

exports.getWishlist = async (req, res) => {
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

        if (user.Jwttoken) {
            const userTokenMatch = token === user.Jwttoken;
            if (!userTokenMatch) {
                return res.status(404).json({ error: true, message: 'User Login Another Device' });
            }
        }
        const userWishlistFind = await userWishlist.find({userId: decodedToken.userId });
        if (userWishlistFind.length > 0) {
            return res.status(200).json({
                error: false,
                message: "Wishlist fetch Successfully !",
                data: userWishlistFind,
            })
        }
        return res.status(200).json({
            error: false,
            message: "Not wishlist"
        })

    } catch (error) {
        console.log("Catch error", error.message);
        return res.status(500).json({
            error: true,
            message: error.message
        })
    }
}

//=============================Only One Wishllist Item Find ====================


exports.getOneWishlist = async (req, res) => {
    const authToken = req.headers.authorization;
    const bussinessId = req.params.bussinessId
    if (!authToken) {
        return res.status(401).json({ error: true, message: 'Unauthorized: Missing authorization token' });
    }
    try {
        if(!bussinessId){
            return res.status(400).json({
                error:true,
                message:"Business Id is Requerd",
            })
        }
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
        if(!user){
            return res.status(404).json({ error: true, message: 'User not found' });  
        }
        if (user.Jwttoken) {
            const userTokenMatch = token === user.Jwttoken;
            if (!userTokenMatch) {
                return res.status(404).json({ error: true, message: 'User Login Another Device' });
            }
        }
        const userWishlistFind = await userWishlist.findOne({bussinessId});
        if (userWishlistFind) {
            return res.status(200).json({
                error: false,
                message: "Wishlist fetch Successfully !",
                data: userWishlistFind,
            })
        }
        return res.status(200).json({
            error: false,
            message: "Not wishlist"
        })

    } catch (error) {
        console.log("Catch error", error.message);
        return res.status(500).json({
            error: true,
            message: error.message
        })
    }
}

//==============================Remove Wishlist ====================

exports.removeWishlist = async (req, res) => {
    const authToken = req.headers.authorization;
    if (!authToken) {
        return res.status(401).json({ error: true, message: 'Unauthorized: Missing authorization token' });
    }
    try {
        const _id = req.params._id
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
        const wishlistItem = await userWishlist.findOneAndDelete({_id});
        if (!wishlistItem) {
            return res.status(404).json({
                error: true,
                message: 'Wishlist item not found',
            });
        }

        return res.status(200).json({
            error: false,
            message: 'Wishlist item removed successfully',
        });
    } catch (error) {
        console.log("Catch error", error.message);
        return res.status(500).json({
            error: true,
            message: error.message
        })
    }
}
