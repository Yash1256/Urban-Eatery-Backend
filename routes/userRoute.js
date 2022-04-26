const express = require("express");
const authController = require("./../controller/authController");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })
const cleanCache = require('./../middlewares/clearCache');

const router = express.Router();

router.put('/loginGoogle', authController.loginGoogle, cleanCache);
router.post('/signup', authController.signup, cleanCache);
router.post('/login', authController.login, cleanCache);
router.post('/uploadImage', upload.single('image'), authController.uploadImage);
router.get('/downloadImage/:key', authController.getImage)

router.use(authController.protect);
router.get('/validateLogin', authController.validateLogin);
router.get('/getMe', authController.getLoggedUserInfo)

router.use(authController.restrictTo('admin'));
router.get('/role/:id/:role', authController.changeRoleTo);

module.exports = router;