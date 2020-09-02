var ProfileModel = require('../models/profileModel');

exports.login_data = function (req, res) {
    console.info("Getting Login Data");
    ProfileModel.getProfileData(req.query.token).then(data => {
        var resData = ProfileModel.formatData(data);
        res.send(resData);
    });
}