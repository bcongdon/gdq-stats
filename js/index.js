const graph = require('./graph.d3.js');
const stats = require('./stats.js');
const DBConnection = require('./data_connection.js');

DBConnection.getTimeseries().then(function(ts){
  graph.handleTimeseries(ts)
  stats.handleTimeseries(ts)

  stats.initOdometers()

  DBConnection.getSchedule().then(function(sched){
    graph.handleGames(sched)
    stats.handleGames(sched)

    graph.initialSetup()

    DBConnection.timeseriesListeners.push(graph.handleGames)
    DBConnection.timeseriesListeners.push(stats.handleGames)

    DBConnection.scheduleListeners.push(graph.handleGames)
    DBConnection.timeseriesListeners.push(stats.handleGames)
  })
})
