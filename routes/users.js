var express = require('express');
const UsersController = require('../controllers/UsersController');
const verifyToken = require('../middleware/VerifyToken');
var router = express.Router();

/* GET users listing. */
router.post('/register', UsersController.register);
router.post('/login', UsersController.login);
router.post('/checkEmail', UsersController.checkEmail);
router.post('/refreshToken', UsersController.refreshToken);
router.get('/getAllAvatar', verifyToken(),UsersController.getAllAvatar);
router.post('/updateProfile', verifyToken(),UsersController.updateProfile);

module.exports = router;
