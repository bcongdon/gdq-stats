"use strict";
var client = irc.client();
var stats_ref = new Firebase("https://sgdq-backend.firebaseio.com/stats");

function queryTwitch(){
    client.api({
        url: "https://api.twitch.tv/kraken/streams/OGNGlobal"
    }, function(err, res, body) {
        if(body && body['stream'] != undefined && "viewers" in body['stream']){
            console.debug("Current viewers: " + body['stream']['viewers']);
            oViewers.innerHTML = body['stream']['viewers'];
        }
        else {
            // Hide element when viewership data unavailable
            $("#viewers_stat").hide()
        }
    });
}

var initial_vals = false;
function setupFirebaseData(){
    stats_ref.on("value", function(data){
        if(!data.val() && !initial_vals) {
            // Hide if we get a NULL object and have no other data
            $("#donations_stat").hide();
            $("#donators_stat").hide();
        }
        initial_vals = true;
        oDonations.innerHTML = data.val().total_donations;
        oDonators.innerHTML  = data.val().num_donators;
        oGames.innerHTML     = data.val().games_played;
        // Show stats elements when query successful
        $("#donations_stat").show();
        $("#donators_stat").show();
    }, function(error) {
        // Hides stats elements when query unsuccessful
        if(initial_vals) {
            return;
        }
        $("#donations_stat").hide();
        $("#donators_stat").hide();
        console.debug(error);
    });
}

// Initial calls
setupFirebaseData();
queryTwitch();

// Repeat the viewer data every 10 seconds
setInterval(function(){
    queryTwitch();

}, 10000);