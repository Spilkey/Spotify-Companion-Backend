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
    // chunking
    let i,j,temparray,chunk = 100;
    for (i=0,j=chunkOfTracks.length; i<j; i+=chunk) {

        // mapping big song objects down to just id
        temparray = (chunkOfTracks.slice(i,i+chunk)).map(songobj => {
            return songobj.track.id;
        });
        // url for getting analysis data 100 at a time
        featureUrl = `https://api.spotify.com/v1/audio-features/?ids=${temparray.join(",")}`

        // promises
        let featureResponse = await fetch(featureUrl, authOptions);
        let featureData = await featureResponse.json();

        trackPromises.push(featureData);
    }

    return await Promise.all(trackPromises);
}


exports.formatAnalysisPlaylist = function (trackData){

    let totalData = []

    //first combine all data;
    trackData.forEach((elm, i) => {
        totalData = [...totalData, ...elm.audio_features];
    });

    // setting up base object for analysis data
    let returnData = {
        duration: [],
        key: [],
        // mode: [],
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

    // looping over our accumlated data and putting it into our new object
    totalData.forEach((elm, i) => {
        returnData.duration.push((Math.round(elm.duration_ms/10000) * 10000)/1000);
        returnData.key.push(elm.key);
        // returnData.mode.push(elm.mode);
        returnData.time_sig.push(elm.time_signature);
        returnData.acousticness.push(roundDecimal(elm.acousticness));
        returnData.danceability.push(roundDecimal(elm.danceability));
        returnData.energy.push(roundDecimal(elm.energy));
        returnData.instrumentalness.push(roundDecimal(elm.instrumentalness));
        returnData.liveness.push(roundDecimal(elm.liveness));
        returnData.loudness.push(roundDecimal(elm.loudness, 0));
        returnData.speechiness.push(roundDecimal(elm.speechiness));
        returnData.valence.push(roundDecimal(elm.valence));
        returnData.tempo.push(roundNumber(roundDecimal(elm.tempo, 0), 5));
    });

    // returning our promise data
    return returnData;
}

function roundDecimal(num, deciamls=1){
    let sigdigs = 10**deciamls;
    return Math.round((num + Number.EPSILON) * sigdigs) / sigdigs
}

function roundNumber(num, digit){
    return Math.ceil(num/digit)*digit;
}
