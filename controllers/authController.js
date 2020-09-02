var AuthModel = require('../models/authModel');

// Display list of all Authors.
exports.refresh_token = function(req, res) {
    console.info("Refreshing Token");
    AuthModel.refreshToken(req.query.refresh_token)
    .then((data) => { 
        res.send(data);
    })
    .catch(e => {
        console.log(e)
    });
};

// Display detail page for a specific Author.
exports.swap_token = function (req, res) {
    console.info("Swapping Token");
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
        console.log(e)
    });
    
};
