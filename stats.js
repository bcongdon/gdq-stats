"use strict";
var client = irc.client()
function queryTwitch(){
    client.api({
        url: "https://api.twitch.tv/kraken/streams/GosuGamers"
    }, function(err, res, body) {
        if(body && body['stream'] != undefined && "viewers" in body['stream']){
            console.debug("Current viewers: " + body['stream']['viewers']);
            oViewers.innerHTML = body['stream']['viewers'];
        }
    });
}

function queryDonations(){
    $.getJSON("https://sgdq-backend.firebaseio.com/stats.json", function(data){
        oDonations.innerHTML = data.total_donations;
        oDonators.innerHTML = data.num_donators;
    });
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