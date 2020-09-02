var ProfileModel = require('../models/profileModel');
var log = require('../middleware/log');

exports.login_data = function (req, res) {
    log.info("Getting Login Data");
    ProfileModel.getProfileData(req.query.token).then(data => {
        var resData = ProfileModel.formatData(data);
        res.send(resData);
    });
}