let fetch = require('node-fetch');
var log = require('../middleware/log');

exports.analyzeSong = async function (access_token, query) {
    let url = 'https://api.spotify.com/v1/search?limit=50&type=track&q=' + query;

    let data = await search(url, access_token);

    return data;
}

exports.analyzePlayList = async function (access_token, playlistId) {
    console.log(playlistId);
    let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100`;

    let trackData = await getAllPlayListData(url, [], access_token);
    return Promise.resolve(trackData);
}

async function getAllPlayListData(url, items, access_token) {
    // use the access token to access the Spotify Web API
    let authOptions = {
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        method: 'get', // *GET, POST, PUT, DELETE, etc.
    }
    let response = await fetch(url, authOptions);
    let data = await response.json();
    return await recursiveGetPL(data, items, access_token);
}

async function recursiveGetPL(data, items, access_token) {
    if (data.error) {
        log.error(data.error)
        console.log(data);
        return data;
    }
    let newData = [...items, ...data.items];
    // if next == null than break recursion
    if (data.next == null) {
        return getChunkTrackAnalysis(newData, access_token);
    } else {
        return getAllPlayListData(data.next, newData, access_token);
    }
}


async function getChunkTrackAnalysis(chunkOfTracks, access_token){
    let trackPromises = [];

    let authOptions = {
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        method: 'get', // *GET, POST, PUT, DELETE, etc.
    }
    //console.log(chunkOfTracks);
    for(i = 0; i < chunkOfTracks.length; i++ ){
        // console.log(chunkOfTracks[i].track.id);
        featureUrl = `https://api.spotify.com/v1/audio-features/${chunkOfTracks[i].track.id}`

        let featureResponse = await fetch(featureUrl, authOptions);
        let featureData = await featureResponse.json();
        trackPromises.push(featureData);
    }
    return await Promise.all(trackPromises);
}


exports.formatAnalysisPlaylist = function (trackData){
    let returnData = {
        duration: [],
        key: [],
        mode: [],
        time_sig: [],
        acousticness: [],
        danceability: [],
        energy: [],
        instrumentalness: [],
        liveness: [],
        loudness: [],
        speechiness: [],
        valence: [],
        tempo: [],
    };
    trackData.forEach((elm, i) => {
        returnData.duration.push(elm.duration_ms)
        returnData.key.push(elm.key);
        returnData.mode.push(elm.mode);
        returnData.time_sig.push(elm.time_sig);
        returnData.acousticness.push(elm.acousticness);
        returnData.danceability.push(elm.danceability);
        returnData.energy.push(elm.energy);
        returnData.instrumentalness.push(elm.instrumentalness);
        returnData.liveness.push(elm.liveness);
        returnData.loudness.push(elm.loudness);
        returnData.speechiness.push(elm.speechiness);
        returnData.valence.push(elm.valence);
        returnData.tempo.push(elm.tempo);
    });
    return returnData;
}
