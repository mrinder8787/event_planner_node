const Business = require('../model/bussinessaddModel');
const jwt = require('jsonwebtoken');
const OwnerData = require('../model/registrion');
const { upload, checkFileSize } = require('../middleware/upload');
const userBase = require("../model/UserModel/userBaseRegisration");



exports.addBusiness = (req, res) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ error: true, message: 'Unauthorized' });
  }
  const token = authToken.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);

  upload(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ message: err });
    } else {
      if (req.file == undefined) {
        console.error('No file selected!');
        return res.status(400).json({ message: 'No file selected!' });
      } else {

        checkFileSize(req, res, () => {
          console.log('Uploaded file:', req.file);

          const {pinCode, name, contactNumber, state, city, address,GSTNo, maxBidAmount, businessDescription } = req.body;
          if (!name || !address,!pinCode) {
            return res.status(400).json({ error: 'BussinessName and fullAdress are required.' });
          }


          const newBusiness = new Business({
            BussinessName: name,
            contactNumber: contactNumber,
            state: state,
            city: city,
            fullAdress: address,
            maxBidAmount: maxBidAmount,
            imageUrl: req.file.path,
            businessDescription,
            GSTNo,
            customerRef: decodedToken.customerRef,
            pinCode,
          });

          newBusiness.save()
            .then(business => res.json({
              error: false,
              message: "Bussiness Add Successfully !",
              data: [business]
            }))
            .catch(err => res.status(500).json({ error: err.message }));
        });
      }
    }
  });
};




//------------------------------- >Get Business Details <-------------------------------


exports.getBusinessUser = async (req, res) => {
  const authToken = req.headers.authorization;
  if (!authToken) {
    return res.status(401).json({ error: true, message: 'Unauthorized: Missing authorization token' });
  }
  try {
    const {customerRef}=req.body;
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
    const businessData = await Business.findOne({customerRef});
    if(!businessData){
      return res.status(400).json({
        error:true,
        message:"Business not find"
      });
    }

    return res.status(200).json({
      error:false,
      message:"Business find successfully ",
      data:businessData
    })


  } catch (e) {
    return res.status(500).json({
      error: true,
      message: e.message
    });
  }
}

//------------------------------- >Get Business Details <-------------------------------


exports.getBusinessOwner = async (req, res) => {
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
  
      if (!decodedToken.customerRef) {
  
        return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
      }
  
      if (!decodedToken.userId) {
  
        return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
      }

    const user = await OwnerData.findOne({customerRef:decodedToken.customerRef});
    if (!user) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }
    if (user.Jwttoken) {
      const userTokenMatch = token === user.Jwttoken;
      if (!userTokenMatch) {
        return res.status(404).json({ error: true, message: 'User Login Another Device' });
      }
    }
    const businessData = await Business.findOne({customerRef:decodedToken.customerRef});
    if(!businessData){
      return res.status(400).json({
        error:true,
        message:"Business not find"
      });
    }

    return res.status(200).json({
      error:false,
      message:"Business find successfully ",
      data:businessData
    })


  } catch (e) {
    return res.status(500).json({
      error: true,
      message: e.message
    });
  }
}


//==========================> Get Business Owner Profile <==============================


exports.getBusinessOwnerProfile = async (req, res) => {
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
  
      if (!decodedToken.customerRef) {
  
        return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
      }
  
      if (!decodedToken.userId) {
  
        return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
      }

    const user = await OwnerData.findOne({customerRef:decodedToken.customerRef});
    if (!user) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }
    if (user.Jwttoken) {
      const userTokenMatch = token === user.Jwttoken;
      if (!userTokenMatch) {
        return res.status(404).json({ error: true, message: 'User Login Another Device' });
      }
    }
    const businessData = await Business.findOne({ customerRef: decodedToken.customerRef }) || {};
    return res.status(200).json({
      error: false,
      message: "Owner Profile Found successfully",
      data: {
        ownerRegName: user.name,
        ownerRegMobileNumber: user.mobileNumber,
        ownerRegEmail: user.email,
        businessName: businessData.BussinessName ?? "",
        businessContNumber: businessData.contactNumber ??  "",
        businessState: businessData.state ??  "",
        businessCity: businessData.city ??  "",
        businessfullAdress: businessData.fullAdress ??  "",
        businessGSTNo: businessData.GSTNo ??  "",
        joinDate: user.createdAt ??  ""
      }
    });

  } catch (e) {
    return res.status(500).json({
      error: true,
      message: e.message
    });
  }
}