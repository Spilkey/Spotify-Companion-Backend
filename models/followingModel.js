var fetch = require('node-fetch');

exports.followingData = async function(access_token, query){
    // use the access token to access the Spotify Web API
    var url =  `https://api.spotify.com/v1/me/following${query}`;
    var authOptions = {
        headers: {
            'Authorization': 'Bearer ' + access_token 
        },
        method: 'get', // *GET, POST, PUT, DELETE, etc.
    }
    let response = await fetch(url, authOptions);
    let body = await response.json();
    return body

}

exports.formatFollowingData = function(body, req){
    var responseBody = {}
    if (!body.error) {
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
        responseBody = {
            data: returnBody
        };
    } else {
        responseBody = {
            data: body
        };
    }
    return responseBody;
}