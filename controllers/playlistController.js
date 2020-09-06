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



