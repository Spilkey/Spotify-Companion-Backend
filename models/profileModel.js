var fetch = require('node-fetch');

exports.getProfileData = async function(access_token){
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
    let length = false;
    length &= body.display_name ? displayData.push({ heading: 'Display Name:', value: body.display_name }) : 0;
    length &= body.email ? displayData.push({ heading: 'Email:', value: body.email }) : 0;
    length &= body.product ? displayData.push({ heading: 'Product Type:', value: body.product }) : 0;
   
    let responseBody = {
        'data': body,
        'missingDataFlag': length,
        'displayName': body.display_name
    };
    return responseBody;
} 




