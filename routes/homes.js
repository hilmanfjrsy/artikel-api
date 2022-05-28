var express = require('express');
const HomeContoller = require('../controllers/HomeContoller');
const verifyToken = require('../middleware/verifyToken');
var router = express.Router();

/* GET users listing. */
router.get('/', HomeContoller.homes);
router.get('/explore', HomeContoller.explore);
router.get('/detail-articles/:id', HomeContoller.detailArticles);
router.get('/my-articles', verifyToken(), HomeContoller.myArticles);

module.exports = router;
