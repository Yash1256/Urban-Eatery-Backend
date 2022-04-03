const express = require("express");
const authController = require("./../controller/authController");

const router = express.Router();

router.put('/loginGoogle', authController.loginGoogle);
router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.use(authController.protect);
router.get('/validateLogin', authController.validateLogin);
router.get('/getMe', authController.getLoggedUserInfo)

router.use(authController.restrictTo('admin'));
router.get('/role/:id/:role', authController.changeRoleTo);

module.exports = router;