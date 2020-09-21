let fetch = require('node-fetch');
var log = require('../middleware/log');

exports.searchSongs = async function(access_token, query){
    let url = 'https://api.spotify.com/v1/search?type=track&q=' + query;

    let data = await search(url, access_token);

    return data;
}

exports.searchPlayLists = async function(access_token, query){
    let url = 'https://api.spotify.com/v1/search?type=playlist&q=' + query;

    let data = await search(url, access_token);

    return data;
}

async function search(url, access_token){
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