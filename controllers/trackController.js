var TrackModel = require('../models/trackModel');
var log = require('../middleware/log');

exports.like_tracks = function (req, res) {
    log.info("Liking Track - " + req.query.trackIds);
    let access_token = req.query.access_token;
    let ids = req.query.trackIds;

    TrackModel.likeTracks(access_token,ids).then(data => {
        console.log(data.status);
        res.send({
            'data': {
                "status": data.status
            }
        })
    });
}

exports.unlike_tracks = function (req, res) {
    log.info("Unliking Track - " + req.query.trackIds);
    let access_token = req.query.access_token;
    let ids = req.query.trackIds;

    TrackModel.unlikeTracks(access_token,ids).then((data) => {
        console.log(data.status);
        res.send({
            'data': {
                "status": data.status
            }
        });
    });
}