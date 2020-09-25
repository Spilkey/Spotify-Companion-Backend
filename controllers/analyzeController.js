var Analyze = require('../models/analyzeModel');
var log = require('../middleware/log');

exports.analyze_song = function (req, res) {
    log.info("Getting Analyze Song Data");
    let access_token = req.query.access_token;
    let query = req.query.params;
    Analyze.analyzeSong(access_token, songId).then(data => {
        res.send({
            'results': data
        })
    });
}

exports.analyze_playlist = function (req, res) {
    log.info("Getting Analyze Playlist Data");
    let access_token = req.query.access_token;
    let playlistId = req.query.playlist_id;
    Analyze.analyzePlayList(access_token, playlistId).then(data => {
        let returnData = Analyze.formatAnalysisPlaylist(data);
        res.send({
            'results': returnData
        })
    });
}
