var express = require('express');
const ArticleController = require('../controllers/ArticleController');
const verifyToken = require('../middleware/verifyToken');
var router = express.Router();

/* GET users listing. */
router.post('/create', verifyToken(), ArticleController.createArticle);
router.post('/update/:id', verifyToken(), ArticleController.updateArticle);
router.get('/delete/:id', verifyToken(), ArticleController.deleteArticle);

module.exports = router;
