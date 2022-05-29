var express = require('express');
const HomeContoller = require('../controllers/HomeContoller');
const verifyToken = require('../middleware/VerifyToken');
var router = express.Router();

/* GET users listing. */
router.get('/', HomeContoller.homes);
router.get('/explore', HomeContoller.explore);
router.get('/detail-articles/:id', HomeContoller.detailArticles);
router.get('/my-articles', verifyToken(), HomeContoller.myArticles);
router.get('/all-category', HomeContoller.getAllCategory);

module.exports = router;
