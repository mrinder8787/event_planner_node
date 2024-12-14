const express = require('express');
const router = express.Router();


const { validateRegistration } = require('../middleware/validation');
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
const allItemCount =require("../Controller/allitemCount");
const accountDetails =require('../Controller/accountDetailsController');
const leaveRequestCrew = require('../Controller/leaveCrewController');
const CalculateProfitloss= require("../Controller/profitLoss");
const crewResignationController = require("../Controller/crewResignController");
const userBaseRegistrion = require("../Controller//UserBaseController/userBaseRegController");

//------------------------------------Start Route Post--------------------------------------------

router.post('/crewUpdate',crewUpdateController.updateCrewEntry);
router.post('/paymentAdd',payment.payment),
router.post('/Owner-registration',adminRegistrion.registraionApi);
router.post('/crewentry',crewEntryController.crewentry);
router.post('/login',loginController.loginApi);
router.post("/login-all",validateRegistration,adminRegistrion.ownerloginApi);
router.post('/customerEntry',customerEntryController.customerentry);
router.post('/booking',bookingController.booking);
router.post('/enquiery',postController.enquiery);
router.post('/userRegitrion',userRegistrion.userRegistrion);
router.post('/passwordchange',passChange.passwordchange);
router.post('/forgatepassword',forgotPassword.forgotPassword);
router.post('/Resetpassword',forgotPassword.resetPassword);
router.post('/addbussiness',addBussiness.addBusiness);
router.post('/OwnerSend-OTP',adminRegistrion.adminSendRegistrionMail);
router.post("/Owner-fsmToken",fsmTokenRoute.fsmtoken);
router.post("/Owner-accountDetails-save",accountDetails.accountDetails);
router.post('/Crewleave-add',leaveRequestCrew.leaveRequestCrew);
router.post('/leaveRequest-Status',leaveRequestCrew.leaveStatusUpadte);
router.post('/profit-loss',CalculateProfitloss.profitLoss);
router.post("/getBookingPayment-Date",paymentGet.getAmountbyDate);
router.post("/crew-Resignation",crewResignationController.crewResignation);
router.post("/userBase-genrateOTP",userBaseRegistrion.genrateOTPUser);
router.post("/userBase-regitrion",userBaseRegistrion.userVerifyOTPLogin);



router.post('/Crew-Delete',crewEntryController.crewDelete);
router.post('/bussiness-ownerDelete', adminRegistrion.bussinessOwnerdelete);
router.post('/customer-delete',customerEntryController.customerDelete);
//--------------------------------------Put Api Route0---------------------------

router.put("/bookingsUpadte/:id",bookingController.bookingUpdate);
router.put('/updatecrew-resignation/:resignationId',crewResignationController.updateCrewResignation)
router.put("/bookingStatusUpadte/:id",bookingController.bookingStatusUpdate);
router.put("/bookingDelete/:_id",bookingController.bookingDelete);

//-------------------------------get Api -----------------------------

router.get("/allItem-Count",allItemCount.allItemCount);
router.get('/bookinglist',postController.getBookinglist);
router.get('/customerlist',postController.getCustomerlist);
router.get('/crewlist',postController.getCrewByCustomerRef);
router.get('/getBussiness',getbussiness.getbussiness);
router.get("/paymentGet",paymentGet.paymentget);
router.get("/getenquery-list",postController.getEnquerylist);
router.get('/getBooking-status',allItemCount.bookingStatusCount);
router.get("/crewNamelist",crewEntryController.getCrewNamelist);
router.get('/getleave-request',leaveRequestCrew.getAllrequest);
router.get("/getBooking-nameId",bookingController.getBookinglistName);
router.get("/getBookingPayment/:bookingId",paymentGet.getAmountbyBookingId);
router.get("/getCrew-Resigntion",crewResignationController.getResignData);


module.exports = router;
