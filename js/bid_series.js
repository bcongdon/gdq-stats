function accumulate(arr) {
  return arr.reduce(function(r, a) {
    r.push((r.length && r[r.length - 1] || 0) + a);
    return r;
  }, []);  
}

// // Grab metadata on the latest json
// getRetry('https://www.googleapis.com/storage/v1/b/sgdq-backend.appspot.com/o/killVsSave.json', function(res) {
//   // Get media link and pipe data to setupAll
//   getRetry(res.mediaLink, setupBidSeries)
// });

getRetry('/data/2016/killVsSave.json', setupBidSeries);

function setupBidSeries(data) {
  // data = JSON.parse(data)
  var accumulatedYs = data.ys.map(function(d) { return accumulate(d.slice(1)) })
  accumulatedYs.forEach(function(d, idx) { d.unshift(data.ys[idx][0]) })
  var chart = graphSeries('#metroid_chat', data.x, accumulatedYs);
  chart.data.colors({
    'Save': d3.rgb('#00AEEF'),
    'Kill': d3.rgb('#F21847')
  });
}

function graphSeries(element, xSeries, yArrs){
  var cols = [xSeries].concat(yArrs);
  return chart = c3.generate({
    bindto: element,
    data: {
      x: 'x',
      columns: cols
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
