$.get('/data/games.csv')
  .pipe( CSV.parse )
  .done( function(rows) {
    handleData(rows)
  });

function handleData(data) {
  var titles       = data.map(function(d) { return d[1]; }),
      runners      = data.map(function(d) { return d[2]; }),
      platform     = data.map(function(d) { return d[3]; }),
      releaseDates = data.map(function(d) { return d[4]; }),
      minutes      = data.map(function(d) { return d[5]; });
  releaseDates.unshift('x');
  minutes.unshift('minutes')
  console.log(releaseDates)
  var chart = c3.generate({
      bindto: '#chart',
      data: {
          x: 'x',
          columns: [
            releaseDates,
            minutes
          ],
          type: 'scatter'
      },
      axis: {
          x: {
              label: 'Release Date',
              tick: {
                  format: '%Y-%m-%d',
                  fit: false
              },
              type: 'timeseries'
          },
          y: {
              label: 'SGDQ Speedrun Time'
          }
      },
      tooltip: {
        format: {
          title: function(d) { return d; },
          value: function(value, ratio, id) { return 5 }
        }
      }
  });
}