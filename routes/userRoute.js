const express = require("express");
const authController = require("./../controller/authController");
const { s3UploadMulter } = require('./../utils/s3');

const router = express.Router();

router.put('/loginGoogle', authController.loginGoogle);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/uploadImage', s3UploadMulter.single('file'), authController.image);

router.use(authController.protect);
router.get('/validateLogin', authController.validateLogin);
router.get('/getMe', authController.getLoggedUserInfo)

router.use(authController.restrictTo('admin'));
router.get('/role/:id/:role', authController.changeRoleTo);

module.exports = router;