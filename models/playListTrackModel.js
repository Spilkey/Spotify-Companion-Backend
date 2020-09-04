let fetch = require('node-fetch');
var log = require('../middleware/log');
/**
 * Gets all the Tracks in a playlist, 
 * formats the data,
 * adds if the song is liked or not
 * 
 * Also grabs playlist metadata 
 * 
 * @param {String} access_token query param for user auth
 * @param {String} playListId query param for play list id
 * 
 * @return {Promise} A promise to the data returned from the api and Promise to meta data.
 */
exports.getPlayListTracks = async function(access_token, playListId){
    // playlist data
    let url = `https://api.spotify.com/v1/playlists/${playListId}?limit=1`;
    
    // tracks
    let trackUrl = `https://api.spotify.com/v1/playlists/${playListId}/tracks?offset=0&limit=100`
    
    let  authOptions = {
        headers: {
            'Authorization': 'Bearer ' + access_token 
        },
        method: 'get', // *GET, POST, PUT, DELETE, etc.
    }
    let response = await fetch(url, authOptions);
    let playlistData = await response.json();
    
    let data = await getAllPlayListTracks(trackUrl, access_token);
    
    //let returnData = await Promise.all([data, playlistData]);

    return Promise.all([data, playlistData]); //returnData ;
}

async function getAllPlayListTracks(url, access_token){
    // use the access token to access the Spotify Web API
    let  authOptions = {
        headers: {
            'Authorization': 'Bearer ' + access_token 
        },
        method: 'get', // *GET, POST, PUT, DELETE, etc.
    }
    let promises = [];
    while(url){
        let response = await fetch(url, authOptions);
        let data = await response.json();
        promises.push(data);
        url = await (data.next ? data.next : false);
    }

    let response = await Promise.all(promises);

    return await accumlateTracksFromPromise(response, access_token);
}

async function accumlateTracksFromPromise(promises, access_token){
    let allTracks = [];
    promises.forEach(element => {
        allTracks = allTracks.concat(element.items);
    });
    console.log(allTracks);
    return await formatTrackData(allTracks, access_token)
}

async function formatTrackData(data, access_token){
    let returnData = [];
    let trackIds = [];
    data.forEach((elm, i) => {
        let item = {};
        item.added_at = elm.added_at;
        item.added_by = elm.added_by.id;
        item.id = elm.track.id;
        trackIds.push(item.id);
        item.name = elm.track.name;
        item.popularity = elm.track.popularity;
        item.preview = elm.track.preview_url;

        returnData.push(item);
    });

    return await checkUserLikedTrack(trackIds, returnData, access_token);
}

async function checkUserLikedTrack(trackIds, returnData, access_token){
    let  authOptions = {
        headers: {
            'Authorization': 'Bearer ' + access_token 
        },
        method: 'get', // *GET, POST, PUT, DELETE, etc.
    }

    let tracksLength = trackIds.length;
    let chunks = tracksLength/50;
    let baseUrl=`https://api.spotify.com/v1/me/tracks/contains?ids=`;
    
    let promises = [];
    for (let i = 1; i < chunks + 1; i++){
        let url;
        if(i*50 > tracksLength){
            url = baseUrl + trackIds.slice( (i-1) * 50, tracksLength).join(',');
        } else {
            url = baseUrl + trackIds.slice((i-1) * 50, (i*50)).join(',');
        }
        promises.push(fetch(url, authOptions).then((response) => { return response.json()}));
    }

    let responses = await Promise.all(promises);
    let likedArray = await addLikedArrays(responses, returnData);
    return likedArray;
}

async function addLikedArrays(responses, returnData){
    log.info('adding likes together')
    let likedArray = [];
    for(let i=0; i < responses.length; i++){
        log.info("value is");
        likedArray = likedArray.concat(responses[i]);
    }
    
    return populateLikedTracks(likedArray, returnData);
}

function populateLikedTracks(likedArray, returnData){
    if(returnData.length == likedArray.length){
        for(let i = 0; i < returnData.length; i++){
            returnData[i].isLiked = likedArray[i];
        }
    }
    return returnData;
}

