"use strict";
var client = irc.client()
function queryTwitch(){
    client.api({
        url: "https://api.twitch.tv/kraken/streams/edward50054"
    }, function(err, res, body) {
        if(body && "stream" in body && "viewers" in body['stream']){
            console.log("Current viewers: " + body['stream']['viewers']);
            odometer.innerHTML = body['stream']['viewers'];
        }
    });
}

queryTwitch();

setInterval(function(){
    queryTwitch();
}, 10000);