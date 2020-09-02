var express = require('express');
var router = express.Router();

var profile_controller = require('../controllers/profileController');

router.get('/login', profile_controller.login_data);

module.exports = router;