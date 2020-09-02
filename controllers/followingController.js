var FollowingModel = require('../models/followingModel');

exports.following_data = function (req, res) {
    console.info("Getting Follower Data");
    var access_token = req.query.access_token;
    var after = req.query.after ? '&after=' + req.query.after : '';

    var query = '?type=artist&limit=18' + after

    FollowingModel.followingData(access_token, query).then(data => {
        resData = FollowingModel.formatFollowingData(data, req);
        res.send(resData);
    });

}