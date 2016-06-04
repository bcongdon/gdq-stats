"use strict";
var client = irc.client()
function queryTwitch(){
    client.api({
        url: "https://api.twitch.tv/kraken/streams/wizardworldgaming"
    }, function(err, res, body) {
        if(body && "stream" in body && "viewers" in body['stream']){
            console.debug("Current viewers: " + body['stream']['viewers']);
            oViewers.innerHTML = body['stream']['viewers'];
        }
    });
}

function queryDonations(){

    setTimeout(function() {oDonations.innerHTML = "0"}, 1000);
}

function gamesCompleted(){
    setTimeout(function() {oGames.innerHTML = "163"}, 1000);
}

queryTwitch();
queryDonations();
gamesCompleted();

setInterval(function(){
    queryTwitch();
    queryDonations();
    gamesCompleted();

}, 10000);