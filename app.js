/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var config = require('./config')

var client_id = config.client_id;
var client_secret = config.client_secret;
/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function (length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

var stateKey = 'spotify_auth_state';

var app = express();

app.use(express.static(__dirname + '/public'))
    .use(cors())
    .use(cookieParser());


app.get('/login', function (req, res) {

    access_token = req.query.token;

    var options = {
        url: 'https://api.spotify.com/v1/me',
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
    };

    // use the access token to access the Spotify Web API
    request.get(options, function (error, response, body) {
        let displayData = [];
        body.image ? displayData.push({ heading: 'Profile Pic:', value: body.image }) : '';
        body.display_name ? displayData.push({ heading: 'Display Name:', value: body.display_name }) : '';
        body.email ? displayData.push({ heading: 'Email:', value: body.email }) : '';
        // body.external_urls ? displayData.push({ heading: 'Open Spotify:', value : "<a href='" +body.external_urls.spotify + "' target='_blank"+body.external_urls.spotify+"</a>"}) : '';
        body.product ? displayData.push({ heading: 'Product Type:', value: body.product }) : '';
        body.type ? displayData.push({ heading: 'User Type:', value: body.type }) : '';
        res.send({
            'data': body,
            'profileData': displayData
        });
    });

});

app.get('/refresh_token', function (req, res) {

    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token;
            console.log(body);
            res.send({
                'access_token': access_token
            });
        } else {
            console.log(body);
        }
    });
});

app.get('/swap', function (req, res) {
    var code = req.query.code;
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')),
        },
        form: {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: 'http://localhost:3000'
        },
        json: true
    }
    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body);
            res.send({
                data: body
            });
        } else {
            console.log(body)
            res.send({
                data: body
            });
        }
    });
});

app.get('/following', function (req, res) {
    var access_token = req.query.access_token;
    var after = req.query.after ? '&after=' + req.query.after : '';

    var query = '?type=artist&limit=18' + after
    var authOptions = {
        url: `https://api.spotify.com/v1/me/following${query}`,
        headers: { 'Authorization': 'Bearer ' + access_token},
        json: true
    }


    request.get(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            // format data
            let artists = body.artists.items || [];

            let length = artists.length;

            let returnBody = {};
            returnBody.artists = [];

            if(length){
                artists.forEach((element, index) => {
                    let formattedElm = {};
                    formattedElm.openUrl = element.external_urls.spotify;
                    formattedElm.apiUrl = element.href;
                    formattedElm.uri = element.uri;
                    formattedElm.follower = element.followers.total;
                    formattedElm.genres = element.genres.join(', ');
                    formattedElm.id =  element.id;
                    formattedElm.image = element.images[0] || null;
                    formattedElm.type = element.type;
                    formattedElm.name = element.name;

                    returnBody.artists.push(formattedElm);
                });
            }
            
            returnBody.after = body.artists.cursors.after;
            returnBody.current = req.query.after || '';
            returnBody.total = body.artists.total;
            res.send({
                data: returnBody
            });
        } else {
            res.send({
                data: body
            });
        }
    });
});

console.log('Listening on 8888');
app.listen(8888);