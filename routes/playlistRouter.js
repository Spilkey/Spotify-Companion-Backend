var express = require('express');
var router = express.Router();

var playlist_controller  = require('../controllers/playlistController');

router.get('/get-playlists', playlist_controller.playlists);

router.get('/get-playlist', playlist_controller.playlist);

module.exports = router;