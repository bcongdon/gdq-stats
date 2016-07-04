"use strict";
var client = irc.client();
var stats_ref = firebase.database().ref("stats");

function queryTwitch(){
    client.api({
        url: "https://api.twitch.tv/kraken/streams/gamesdonequick"
    }, function(err, res, body) {
        if(body && body['stream'] != undefined && "viewers" in body['stream']){
            // console.debug("Current viewers: " + body['stream']['viewers']);
            $("#oViewers").text(body['stream']['viewers']);
        }
        else {
            // Hide element when viewership data unavailable
            // $("#viewers_stat").hide()
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
        data = data.val();
        initial_vals = true;
        $("#oDonations").text(data.total_donations);
        $("#oDonators").text(data.num_donators);
        $("#oGames").text(data.games_played);
        $("#oChats").text(data.total_chats);
        $("#oEmotes").text(data.total_emotes);
        $("#oTweets").text(data.total_tweets);
        // Show stats elements when query successful
        $("#donations_stat").show();
        $("#donators_stat").show();
    }, function(error) {
        // Hides stats elements when query unsuccessful
        if(initial_vals) {
            return;
        }
        $("#donations_stat").hide();
        // $("#donators_stat").hide();
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