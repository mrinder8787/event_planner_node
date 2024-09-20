const customerEntry=require('../model/customerentryModel');
const jwt = require('jsonwebtoken');
const User = require('../model/registrion');
const crewentry =require('../model/crewentry');
const userRegistrion =require('../model/userregistrion');

require('dotenv').config();


const generateRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  
  const generateCustomerId = (customerName, mobileNumber) => {
    const namePart = customerName.substring(0, 4).toUpperCase();
    const randomPart = generateRandomNumber(100000, 999999); 
    return `${namePart}${randomPart}`;
  };


exports.customerentry = async (req, res) => {
    const { customerName, customerNumber, customerEmail, altContact, Address, State, City, pincode, reamark, Dateofbirth, publishDate,crewId,
      Whosenameby,
     } = req.body;
    const authToken = req.headers.authorization;
  
    if (!authToken) {
      return res.status(401).json({ error: true, message: 'Unauthorized' });
    }


    try {
      const token = authToken.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
      if(decodedToken.userid===null || decodedToken.customerRef===null){
        return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
      }
      console.log('decode token',decodedToken);
    
      const userId = decodedToken.userId;
      const user = await User.findById(userId);
      
       const userFound =await userRegistrion.findOne({userid:decodedToken.userid});

      //  console.log("costomer find",userFound);

  
      if (!user) {
        const  crewfound=await crewentry.findOne({crewid:decodedToken.crewid});
          if(crewfound){
          if(crewfound.canAddCoustomer===false){
            return res.status(404).json({ error: true, message: 'Not A permission' });
          }else{
            //-----------------------save data and permision------------------
            const customerId = generateCustomerId(customerName, customerNumber);
            const newcustomerentry = new customerEntry({
              customerId: customerId,
              customerName: customerName,
              customerNumber: customerNumber,
              customerEmail: customerEmail,
              altContact: altContact,
              Address: Address,
              State: State,
              City: City,
              pincode: pincode,
              Adharcard: req.body.Adharcard, 
              reamark: reamark,
              customerRef:decodedToken.customerRef,
              publishDate: publishDate,
              crewId:decodedToken.crewid,
              Whosenameby:crewfound.crewName,
            });
        
            const savedcustomerentry = await newcustomerentry.save();
        
            return res.status(200).json({
              error: false,
              message: 'Crew Customer Entry Saved Successfully!',
              data: savedcustomerentry,
            });
  
          }
//----------------------------------------User Registrion type ---------------------------------

        }else if(userFound){
          const { customerRef}=req.body;
          const user = await User.findOne({customerRef:customerRef});
          const userFoundbyCust = await customerEntry.findOne({
            $and: [
              { customerRef: customerRef },
              { customerId: decodedToken.userid}
            ]
          });
          console.log('user found',userFoundbyCust);
          if(userFoundbyCust){
            return res.status(400).json({
              error: false,
              message: 'User Alredy add This Bussinse',
              data:[],
            });

          }
        console.log("userdataga",user);
          const newcustomerentry = new customerEntry({
            userId: user._id,
            customerId: decodedToken.userid,
            customerName: customerName,
            customerNumber: customerNumber,
            customerEmail: userFound.email,
            altContact: altContact,
            Address: Address,
            State: State,
            City: City,
            pincode: pincode,
            Adharcard: req.body.Adharcard, 
            reamark: reamark,
            customerRef: customerRef,
            publishDate: publishDate,
          });
      
          const savedcustomerentry = await newcustomerentry.save();
           return res.status(200).json({
              error: false,
              message: 'User Entry Saved Successfully!',
              data: savedcustomerentry,
            });

        }
        return res.status(404).json({ error: true, message: 'User not found' });
      }

  //---------------------Bussiness Owener Add Customere-----------------------------

      const customerId = generateCustomerId(customerName, customerNumber);
      console.log("user dataga");
      const newcustomerentry = new customerEntry({
        userId: user._id,
        customerId: customerId,
        customerName: customerName,
        customerNumber: customerNumber,
        customerEmail: customerEmail,
        altContact: altContact,
        Address: Address,
        State: State,
        City: City,
        pincode: pincode,
        Adharcard: req.body.Adharcard, 
        reamark: reamark,
        customerRef: decodedToken.customerRef,
        publishDate: publishDate,
      });
  
      const savedcustomerentry = await newcustomerentry.save();
  
      return res.status(200).json({
        error: false,
        message: 'Customer Entry Saved Successfully!',
        data: savedcustomerentry,
      });
    } catch (error) {
      console.error('Error saving customer entry:', error.message);
      if (error.name === 'JsonWebTokenError') {
        return res.status(400).json({ error: true, message: 'Please login Unauthorized' });
      }
      return res.status(400).json({ error: true, message: error.message,data:Array() });
    }
  };