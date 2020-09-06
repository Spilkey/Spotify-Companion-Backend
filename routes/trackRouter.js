var express = require('express');
var router = express.Router();

var track_controller  = require('../controllers/trackController.js');

router.post('/like-tracks', track_controller.like_tracks);

router.post('/unlike-tracks', track_controller.unlike_tracks);

module.exports = router;