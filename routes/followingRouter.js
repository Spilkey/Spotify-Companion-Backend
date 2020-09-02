var express = require('express');
var router = express.Router();

var following_controller = require('../controllers/followingController');

router.get('/following', following_controller.following_data);

module.exports = router;