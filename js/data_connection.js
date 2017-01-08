'use strict'
const GDQ_API_ENDPOINT = 'https://api.gdqstat.us'
const GDQ_STORAGE_ENDPOINT = 'http://storage.api.gdqstat.us'

var DBConnection = {
  timeseries: undefined,
  schedule: undefined,
  timeseriesListeners: [],
  scheduleListeners: [],
  fetchInitial: function() {
    return new Promise(function(resolve, rej){
      getRetry(GDQ_STORAGE_ENDPOINT + '/latest.json', function(res) {
        DBConnection.updateWithNewData(JSON.parse(res))
        DBConnection.fetchRecent().then(function() {
          resolve()          
        })
      })
    })
  },
  fetchRecent: function() {
    return new Promise(function(resolve, rej){
      var url = GDQ_API_ENDPOINT + '/recentEvents'
      var most_recent = DBConnection.mostRecentTime();
      if(most_recent) {
        url += '?since=' + most_recent
      }
      getRetry(url, function(res) {
        DBConnection.updateWithNewData(res)
        resolve(DBConnection.timeseries)
      })
    })
  },
  updateWithNewData: function(data) {
    for (var i = 0; i < data.length; i++) {
      data[i].time = new Date(data[i].time)
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
        DBConnection.schedule = JSON.parse(res)
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