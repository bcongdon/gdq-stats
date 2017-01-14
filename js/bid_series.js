'use strict';

getRetry('http://storage.api.gdqstat.us/killVsSave.json', function(res) {
  setupBidSeries(res)
});

function setupBidSeries(data) {
  data = JSON.parse(data)
  var xVals = data.map(function(d) { return new Date(d.time) });
  xVals.unshift('x')
  var killVals = ['Kill'],
      saveVals = ['Save'];
  for (var i = 0; i < data.length; i++) {
    if(i > 0) {
      data[i].save += data[i - 1].save;
      data[i].kill += data[i - 1].kill;
    }
    killVals.push(data[i].kill);
    saveVals.push(data[i].save);
  }
  graphSeries('#metroid_chart', xVals, [killVals, saveVals]);
}

function graphSeries(element, xSeries, yArrs){
  var cols = [xSeries].concat(yArrs);
  console.log(cols)
  return c3.generate({
    bindto: element,
    data: {
      x: 'x',
      columns: cols,
      colors: {
        'Save': d3.rgb('#00AEEF'),
        'Kill': d3.rgb('#F21847')
      }
    },
    axis: {
      x: {
        type: 'timeseries',
        tick: {
          format: '%Y-%m-%d %I:%M%p',
          fit: false,
          count: 9
        }
      },
      y: {
        // min: 0,
        // padding: {
        //   bottom: 0
        // },
        tick: {
          format: d3.format("$,")
        }
      }
    },
    point: {
      r: 1
    },
    tooltip: {
      format: {
        value: function (value, ratio, id) {
          var format = d3.format('$,.2f');
          return format(value);
        }
      }
    },
    zoom: {
      enabled: true,
      rescale: true
    }
  });
}
