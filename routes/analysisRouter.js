var express = require('express');
var router = express.Router();

var analyze_controller = require('../controllers/analyzeController');

router.get('/analyze-song', analyze_controller.analyze_song);

router.get('/analyze-playlist', analyze_controller.analyze_playlist);

module.exports = router;