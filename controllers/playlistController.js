var PLModel = require('../models/playListModel');
var PLTracksModel = require('../models/playListTrackModel');
var log = require('../middleware/log');

exports.playlists = function (req, res) {
    log.info("Getting Playlist Data");
    let access_token = req.query.access_token;
    PLModel.getPlayLists(access_token).then(data => {
        res.send({
            'data': data
        })
    });
}

exports.playlist = function (req, res) {
    log.info("Getting Playlists Data");
    let access_token = req.query.access_token;
    let playlistId = req.query.playlist_id;
    PLTracksModel.getPlayListTracks(access_token, playlistId).then(data => {
        data[0].tracks = {};
        res.send({
            'data': data[0],
            'meta-data': data[1]
        })
    });
}

exports.user_playlists = function (req, res) {
    log.info("Getting User-Playlists Data");
    //TODO format track data into easily readable UI object
    //TODO check if track is liked or not with 
    // https://api.spotify.com/v1/me/tracks/contains
    // https://developer.spotify.com/documentation/web-api/reference/library/check-users-saved-tracks/

    
}

