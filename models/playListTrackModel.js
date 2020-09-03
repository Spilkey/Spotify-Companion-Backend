let fetch = require('node-fetch');
var log = require('../middleware/log');
const { response } = require('express');


exports.getPlayListTracks = async function(access_token, playListId){
    let url = `https://api.spotify.com/v1/playlists/${playListId}?limit=100`;
    
    let data = await getAllPlayListTracks(url, [], access_token);
    
    return data;
}

async function getAllPlayListTracks(url, items, access_token){
    // use the access token to access the Spotify Web API
    let  authOptions = {
        headers: {
            'Authorization': 'Bearer ' + access_token 
        },
        method: 'get', // *GET, POST, PUT, DELETE, etc.
    }
    let response = await fetch(url, authOptions);
    let data = await response.json();
    return await recursiveGetTrack(data, items, access_token);
}

async function recursiveGetTrack(data, items, access_token){
    console.log(data);
    let newData = [...items, ...data.tracks.items]
    // if next == null than break recursion
    if(data.next == null){
        return formatTrackData(newData);
    }else{
        return getAllPlayListTracks(data.next, newData, access_token);
    }
}

function formatTrackData(data){
    
    return data
}