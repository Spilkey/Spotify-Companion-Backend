var express = require('express');
var router = express.Router();

var auth_controller = require('../controllers/authController');

router.get('/refresh_token', auth_controller.refresh_token);

router.get('/swap', auth_controller.swap_token);

module.exports = router;