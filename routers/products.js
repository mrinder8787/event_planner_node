const express = require('express');
const router = express.Router();
const postController = require('../Controller/firstapicontroler');
const loginController = require('../Controller/loginController');
const customerEntryController=require('../Controller/customerEntry');
const crewEntryController =require('../Controller/crewentryController');
const bookingController=require('../Controller/bookingController');

const crewUpdateController =require('../Controller/crewUpdateController');

const userRegistrion =require('../Controller/userRegController');
const passChange= require('../Controller/passwordChangeControl');

const forgotPassword =require('../Controller/forgatePassController');
const addBussiness = require('../Controller/bussinessController');

const adminRegistrion = require('../Controller/adminregistrion');


const fsmTokenRoute = require('../Controller/fsmtokenController');

const getbussiness =require('../ControllergetApi/getBussiness');

const paymentGet = require("../Controller/paymentgetController");
const payment = require("../Controller/paymentController");
//--------------------------------------------------------------------------------

router.post('/crewUpdate',crewUpdateController.updateCrewEntry);

router.get('/getBussiness',getbussiness.getbussiness);
router.get("/paymentGet",paymentGet.paymentget);
router.post('/paymentAdd',payment.payment),
//====================================================================================

router.post('/registrion',adminRegistrion.registraionApi);
router.post('/crewentry',crewEntryController.crewentry);
router.get('/crewlist',postController.getCrewByCustomerRef);
router.post('/login',loginController.loginApi);
router.post('/customerEntry',customerEntryController.customerentry);

router.get('/customerlist',postController.getCustomerlist);
router.post('/booking',bookingController.booking);
router.get('/bookinglist',postController.getBookinglist);

router.post('/enquiery',postController.enquiery);

router.post('/userRegitrion',userRegistrion.userRegistrion);
router.post('/passwordchange',passChange.passwordchange);

router.post('/forgatepassword',forgotPassword.forgotPassword);
router.post('/Resetpassword',forgotPassword.resetPassword);
router.post('/addbussiness',addBussiness.addBusiness);
router.post('/adminRegistrion',adminRegistrion.adminSendRegistrionMail);

router.post("/fsmToken",fsmTokenRoute.fsmtoken);

//-------------------------------get Api -----------------------------



module.exports = router;
