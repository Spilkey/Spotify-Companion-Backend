let fetch = require('node-fetch');
var log = require('../middleware/log');
const { json } = require('express');

exports.likeTracks = async function(access_token, ids){
    let data = await modifyTracks(access_token, ids, 'put');
    return data;
}

exports.unlikeTracks = async function(access_token, ids){
    let data = await modifyTracks(access_token, ids, 'delete');
    return data;
}


async function modifyTracks(access_token, ids, type){
    // use the access token to access the Spotify Web API
    let url = 'https://api.spotify.com/v1/me/tracks';
    console.log(ids);
    let  authOptions = {
        headers: {
            'Authorization': 'Bearer ' + access_token,
            'Content-Type': "application/json" 
        },
        method: type, // *GET, POST, PUT, DELETE, etc.
        body: JSON.stringify({
            'ids': ids
        })
    }
    let response = await fetch(url, authOptions);
    return response;
}