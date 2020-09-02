var fetch = require('node-fetch');
const { response } = require('express');

exports.getProfileData = async function(access_token){
    var responseBody = {};
    var url = 'https://api.spotify.com/v1/me';

    // use the access token to access the Spotify Web API
    var authOptions = {
        headers: {
            'Authorization': 'Bearer ' + access_token 
        },
        method: 'get', // *GET, POST, PUT, DELETE, etc.
    }
    let response = await fetch(url, authOptions);
    let body = await response.json();
    return body;
}

exports.formatData = function(body){
    let displayData = []; 
    body.image ? displayData.push({ heading: 'Profile Pic:', value: body.image }) : '';
    body.display_name ? displayData.push({ heading: 'Display Name:', value: body.display_name }) : '';
    body.email ? displayData.push({ heading: 'Email:', value: body.email }) : '';
    // body.external_urls ? displayData.push({ heading: 'Open Spotify:', value : "<a href='" +body.external_urls.spotify + "' target='_blank"+body.external_urls.spotify+"</a>"}) : '';
    body.product ? displayData.push({ heading: 'Product Type:', value: body.product }) : '';
    body.type ? displayData.push({ heading: 'User Type:', value: body.type }) : '';
    responseBody = {
        'data': body,
        'profileData': displayData
    };
    return responseBody;
} 




