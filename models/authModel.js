
var config = require('../config');
var fetch = require('node-fetch');
const { URLSearchParams } = require('url');

var client_id = config.client_id;
var client_secret = config.client_secret;

exports.refreshToken = async function (refresh_token) {
    var returnBody = {};
    var url = 'https://accounts.spotify.com/api/token';
    var authOptions = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
        body: JSON.stringify({
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        }),
        method: 'post', // *GET, POST, PUT, DELETE, etc.
    }
    let response = await fetch(url, authOptions);
    let body = await response.json();
    return returnBody;
}


exports.swapToken = async function (code) {
    
    var url = 'https://accounts.spotify.com/api/token';

    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', 'http://localhost:3000');
    
    var authOptions = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')),
        },
        body: params,
        method: 'post', // *GET, POST, PUT, DELETE, etc.
    }
    let response = await fetch(url, authOptions);
    let body = await response.json();

    return body;
}
