var express = require('express');
const ViewsController = require('../controllers/ViewsController');
const verifyToken = require('../middleware/verifyToken');
var router = express.Router();

/* GET users listing. */
router.post('/generate', ViewsController.generate);
router.get('/statistik', verifyToken(), ViewsController.statistik);
router.get('/visit-articles', ViewsController.view);

module.exports = router;
