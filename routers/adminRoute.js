const express = require('express');
const router = express.Router();
const ownerController = require('../Controller/AdminController/ownerControllers');
const userController = require('../Controller/AdminController/userControllers');


router.get("/owner-data",ownerController.getOwnerData);
router.get("/user-data",userController.getUserData);
module.exports = router;