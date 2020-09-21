var express = require('express');
var router = express.Router();

var search_controller = require('../controllers/searchController');

router.get('/search-songs', search_controller.search_songs);

router.get('/search-playlists', search_controller.search_playlists);

module.exports = router;