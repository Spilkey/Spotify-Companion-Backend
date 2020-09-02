var AuthModel = require('../models/authModel');
var log = require('../middleware/log');

// Display list of all Authors.
exports.refresh_token = function(req, res) {
    log.info("Refreshing Token");
    AuthModel.refreshToken(req.query.refresh_token)
    .then((data) => { 
        res.send(data);
    })
    .catch(e => {
        log.error(e)
    });
};

// Display detail page for a specific Author.
exports.swap_token = function (req, res) {
    log.info("Swapping Token");
    AuthModel.swapToken(req.query.code)
    .then((data) => {
        if (!data.error) {
            let returnBody = {
                'data': data,
                'error': null,
            }
            res.send(returnBody);
        } else {

            let returnBody = {
                'msg': data.error_description,
                'error': data.error,
            }  
            res.send(returnBody);
        }
    })
    .catch(e => {
        log.error(e)
    });
};

