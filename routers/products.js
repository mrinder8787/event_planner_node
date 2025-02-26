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
const addBussinessController = require('../Controller/bussinessController');
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
const bussinessControllerUser = require('../Controller/UserBaseController/userBussinessDetails');
const userWishlistController =require("../Controller/UserBaseController/userWishlistController");
const userEventBookController = require('../Controller/UserBaseController/userBookEventController');
const userAddressController =require("../Controller/UserBaseController/userAddressController");
const ownerEventController = require("../Controller/UserBaseController/eventbookController");
const userFcmTokenController = require("../Controller/UserBaseController/usersaveFsmToken");
const userPaymentAmount = require("../Controller/UserBaseController/advancePaymentController");
const gstCalculaterController = require("../Controller/gstCalculater");
const { validateQuotation } = require("../middleware/quotationMiddleware");
const quotationController = require("../Controller/quotationController");
const sendQuotationEmail = require("../Controller/quotationMailController");
const upload = require("../middleware/quotationPdf");

//------------------------------------Start Route Post--------------------------------------------

router.post("/quotation-send-email", upload.single("pdfPath"), sendQuotationEmail.sendQuotationEmail);
router.post("/create-Quotation", validateQuotation, quotationController.createQuotation);
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
router.post('/forgatepassword-otpverfiy',forgotPassword.verifyOtp);
router.post('/Resetpassword',forgotPassword.resetPassword);
router.post('/addbussiness',addBussinessController.addBusiness);
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
router.post("/userprofile-update",userBaseRegistrion.userUpdateProfile);
router.post("/getBussiness-ids",bussinessControllerUser.getBussinessByIds);
router.post("/addWishlist-user",userWishlistController.addWishlist);
router.post("/userBook-Event",userEventBookController.bookEventUser);
router.post("/ownerBook-Eventforuser",userEventBookController.bookEventbyOwnerforUser);
router.post("/ownerUpdate-status",userEventBookController.ownerUpdateEvent);
router.post("/userAdd-address",userAddressController.addUserAddress);
router.post("/userUpdate-address",userAddressController.updateUserAddress);
router.post("/eventBook-byowner",ownerEventController.addBookEventOwner);
router.post("/eventItem-byowner",ownerEventController.addEventItemOwner);
router.post("/userSave-fcmToken",userFcmTokenController.saveuserFcmToken);
router.post("/paymentby-user",userPaymentAmount.advancePaymentUser);
router.post("/calculate-gst",gstCalculaterController.gstCalculater);
router.post("/noticationsend-event",gstCalculaterController.sendNotification);
router.post("/getBusiness",addBussinessController.getBusinessUser);
router.post('/Crew-Delete',crewEntryController.crewDelete);
router.post('/bussiness-ownerDelete', adminRegistrion.bussinessOwnerdelete);
router.post('/customer-delete',customerEntryController.customerDelete);


//--------------------------------------Put Api Route0---------------------------

router.put("/bookingsUpadte/:id",bookingController.bookingUpdate);
router.put('/updatecrew-resignation/:resignationId',crewResignationController.updateCrewResignation)
router.put("/bookingStatusUpadte/:id",bookingController.bookingStatusUpdate);
router.put("/bookingDelete/:_id",bookingController.bookingDelete);
router.put("updateQuoation/:id", validateQuotation,quotationController.updateQuotation);
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
router.get("/getOwnerFcmToken",fsmTokenRoute.getFcmToken);
router.get("/getBussiness/:_id",bussinessControllerUser.getBussinessByid);
router.get("/getBussiness-byCity/:city",bussinessControllerUser.getBussinessByCity);
router.get("/getwishlist-user",userWishlistController.getWishlist);
router.get("/getOwnerEvent-list",userEventBookController.getOwnerEventList);
router.get("/getOnewishlist-user/:bussinessId",userWishlistController.getOneWishlist);
router.get("/getUserProfile-owner/:userId",userBaseRegistrion.userFindProfileOwner);
router.get("/removeTo-wishlist/:_id",userWishlistController.removeWishlist);
router.get("/getUserEvent-list",userEventBookController.getUserEventList);
router.get("/getuser-address",userAddressController.getUserAddress);
router.get("/getUserDefaultAddress",userAddressController.getUserDefaultAddress);
router.get("/userAddress-delete/:_id",userAddressController.userAddressDelete);
router.get("/getOwner-Event",ownerEventController.getBookEventOwner);
router.get("/getOwner-Eventitem",ownerEventController.getEventItemOwner);
router.get("/getEventuser/:customerRef",ownerEventController.getBookEventUser);
router.get("/getEventitemUser/:customerRef",ownerEventController.getEventItemUser);
router.get("/getUserfcmToken",userFcmTokenController.getuserFcmToken);
router.get("/getFcmTokenOwnerbyUser/:CustomerRef",fsmTokenRoute.getFcmTokenOwnerbyUser);
router.get("/getfcmToken-byowner/:userId",userFcmTokenController.getuserFcmTokenOwner);
router.get("/userGetData",userBaseRegistrion.userFindProfile);
router.get("/getBusinessOwner",addBussinessController.getBusinessOwner);
router.get("/getOwnerProfile",addBussinessController.getBusinessOwnerProfile);
router.get("/getAllQuotations", quotationController.getAllQuotations);
router.get("/getQuotations/:id", quotationController.getQuotationById);

router.delete("/deleteQuotation/:id", quotationController.deleteQuotation);

module.exports = router;
