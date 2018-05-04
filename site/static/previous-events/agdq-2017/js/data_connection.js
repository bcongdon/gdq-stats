'use strict'
const GDQ_API_ENDPOINT = 'https://api.gdqstat.us'
// const GDQ_STORAGE_ENDPOINT = 'http://storage.api.gdqstat.us'
const GDQ_STORAGE_ENDPOINT = '/data/2017/agdq_final'

var DBConnection = {
  timeseries: undefined,
  schedule: undefined,
  timeseriesListeners: [],
  scheduleListeners: [],
  fetchInitial: function() {
    return new Promise(function(resolve, rej){
      getRetry(GDQ_STORAGE_ENDPOINT + '/latest.json', function(res) {
        res = (typeof res === 'string' || res instanceof String) ? JSON.parse(res) : res;
        DBConnection.updateWithNewData(res)
        DBConnection.fetchRecent().then(function() {
          resolve()          
        })
      })
    })
  },
  fetchRecent: function() {
    return new Promise(function(resolve, rej){
      resolve(DBConnection.timeseries)
      // var url = GDQ_API_ENDPOINT + '/recentEvents'
      // var most_recent = DBConnection.mostRecentTime();
      // if(most_recent) {
      //   url += '?since=' + most_recent.toISOString()
      // }
      // getRetry(url, function(res) {
      //   DBConnection.updateWithNewData(res)
      //   resolve(DBConnection.timeseries)
      // })
    })
  },
  updateWithNewData: function(data) {
    // Do some minor manipulations of data to keep assumptions about data correct
    for (var i = 0; i < data.length; i++) {
      data[i].time = new Date(data[i].time)
      for(var k in data[i]) {
        if (data[i][k] == null) {
          data[i][k] = -1
        }
      }
    }
    data.sort(function(a, b) { return a.time - b.time})
    if(!DBConnection.timeseries || DBConnection.timeseries.length == 0){
      DBConnection.timeseries = data
    }
    else{
      var most_recent_time = DBConnection.mostRecentTime()
      data = data.filter(function(d) { return d.time > most_recent_time })
      DBConnection.timeseries = DBConnection.timeseries.concat(data)
    }
    DBConnection.callTimeseriesListeners()
  },
  mostRecentTime: function() {
    if(!DBConnection.timeseries) return 0;
    return DBConnection.timeseries[DBConnection.timeseries.length - 1].time
  },
  refreshTimeseries: function() {
    return new Promise(function(res, rej){
      DBConnection.fetchRecent().then(function(){
        res(DBConnection.timeseries)
      })
    })
  },
  refreshSchedule: function() {
    return new Promise(function(resolve, rej){
      var url = GDQ_STORAGE_ENDPOINT + '/schedule.json'
      getRetry(url, function(res) {
        DBConnection.schedule = (typeof res === 'string' || res instanceof String) ? JSON.parse(res) : res;
        for (var i = 0; i < DBConnection.schedule.length; i++) {
          DBConnection.schedule[i].start_time = moment.utc(DBConnection.schedule[i].start_time)
        }
        DBConnection.schedule.sort(function(a, b) { return a.start_time - b.start_time })
        DBConnection.callScheduleListeners()
        resolve(DBConnection.schedule)
      })
    })
  },
  callTimeseriesListeners: function() {
    for (var i = 0; i < DBConnection.timeseriesListeners.length; i++) {
      DBConnection.timeseriesListeners[i](DBConnection.timeseries)
    }
  },
  callScheduleListeners: function() {
    for (var i = 0; i < DBConnection.scheduleListeners.length; i++) {
      DBConnection.scheduleListeners[i](DBConnection.schedule)
    }
  },
  getTimeseries: function() {
    return new Promise(function(res, rej){
      if(DBConnection.timeseries) res(DBConnection.timeseries)
      else {
        DBConnection.fetchInitial().then(function(){
          res(DBConnection.timeseries)
        })
      }
    })
  },
  getSchedule: function() {
    return new Promise(function(res, rej){
      if(DBConnection.schedule) res(DBConnection.schedule)
      else {
        DBConnection.refreshSchedule().then(function(){
          res(DBConnection.schedule)
        })
      }
    })
  }
}

DBConnection.fetchInitial()

DBConnection.refreshSchedule()

setInterval(function() {
  DBConnection.refreshTimeseries()
}, 60 * 1000)

setInterval(function() {
  DBConnection.refreshSchedule()
}, 5 * 60 * 1000)