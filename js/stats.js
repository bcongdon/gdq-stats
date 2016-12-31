"use strict";

function totalDonations(data){
    return 
}

function totalDonators(data){
    return data[DBConnection.mostRecentTime()].d
}

function populateStatsOdometers(data) {
    $("#oDonations").text(data[data.length - 1].m);
    $("#oDonators").text(data[data.length - 1].d);
    // $("#oGames").text(data.games_played);
    $("#oChats").text(data.reduce(function(a, b){ return a + b.c }, 0));
    $("#oEmotes").text(data.reduce(function(a, b){ return a + b.e }, 0));
    $("#oTweets").text(data.reduce(function(a, b){ return a + b.t }, 0));
}

DBConnection.scheduleListeners.push(populateStatsOdometers)
DBConnection.getTimeseries().then(function(data){
    populateStatsOdometers(data)
})
