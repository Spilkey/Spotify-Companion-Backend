var Search = require('../models/searchModel');

var log = require('../middleware/log');

exports.search_songs = function (req, res) {
    log.info("Getting Playlist Data");
    let access_token = req.query.access_token;
    let query = req.query.params;
    Search.searchSongs(access_token, query).then(data => {
        res.send({
            'results': data
        })
    });
}

exports.search_playlists = function (req, res) {
    log.info("Getting Playlists Data");
    let access_token = req.query.access_token;
    let query = req.query.params;
    console.log(query)
    Search.searchPlayLists(access_token, query).then(data => {
        res.send({
            'results': data
        })
    });
}

