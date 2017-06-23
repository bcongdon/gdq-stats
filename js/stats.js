"use strict";
const $ = require('jquery');

function accumulateStats(data) {
    var c_acc = 0,
        e_acc = 0,
        t_acc = 0;
    for (var i = 0; i < data.length; i++) {
        c_acc += data[i].c;
        e_acc += data[i].e;
        t_acc += data[i].t;
    }
    return {
        c: c_acc,
        e: e_acc,
        t: t_acc
    }
}

function populateStatsOdometers(data) {
    var donations = data[data.length - 1].m.toFixed(2);
    $("#oDonations").text(donations);
    $("#oDonators").text(data[data.length - 1].d);
    // $("#oViewers").text(data[data.length - 1].v);
    $("#oViewers").text(Math.max(data.reduce(function(a,b) { 
        return a > b.v ? a : b.v;
    }, 0)));
    var acc_stats = accumulateStats(data)
    $("#oChats").text(acc_stats.c);
    $("#oEmotes").text(acc_stats.e);
    $("#oTweets").text(acc_stats.t);
}

function populateGamesOdometer(data) {
    // var num_completed = 0,
    //     i = 0,
    //     now = new Date();
    // while(data[i].start_time < now){
    //     num_completed += 1
    //     i += 1
    // }
    // num_completed = Math.max(0, num_completed - 1);
    $("#oGames").text(data.length);
}

module.exports = {
    handleGames: populateGamesOdometer,
    handleTimeseries: populateStatsOdometers
}

