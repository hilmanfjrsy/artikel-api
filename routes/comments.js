var express = require('express');
const CommetsController = require('../controllers/CommetsController');
const verifyToken = require('../middleware/verifyToken');
var router = express.Router();

/* GET users listing. */
router.post('/create', verifyToken(), CommetsController.create);
router.get('/get-all', CommetsController.getAll);

module.exports = router;
