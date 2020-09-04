let fetch = require('node-fetch');
var log = require('../middleware/log');

exports.getPlayLists = async function(access_token){
    let url = 'https://api.spotify.com/v1/me/playlists?limit=50';

    let data = await getAllPlayLists(url, [], access_token);

    return data;
}

async function getAllPlayLists(url, items, access_token){
    // use the access token to access the Spotify Web API
    let  authOptions = {
        headers: {
            'Authorization': 'Bearer ' + access_token 
        },
        method: 'get', // *GET, POST, PUT, DELETE, etc.
    }
    let response = await fetch(url, authOptions);
    let data = await response.json();
    return await recursiveGetPL(data, items, access_token);
}

async function recursiveGetPL(data, items, access_token){
    if(data.error){
        log.error(data.error)
        console.log(data);
        return data;
    }
    let newData = [...items, ...data.items];
    // if next == null than break recursion
    if(data.next == null){
        return formatPlayListData(newData);
    }else{
        return getAllPlayLists(data.next, newData, access_token);
    }
}

function formatPlayListData(data){

    let returnData = [];
    data.forEach((elm, i) => {
        let item = {};

        item.playListId = elm.id;
        item.image = elm.image || null;
        item.playListName = elm.name;
        item.playListOwner = elm.owner.id;
        item.playListOwnerType = elm.owner.type;
        item.playListAmount = elm.tracks.total;

        returnData.push(item);

    });
    return returnData;
}



