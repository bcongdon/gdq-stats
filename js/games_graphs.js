// Grab metadata on the latest json
getRetry('https://www.googleapis.com/storage/v1/b/sgdq-backend.appspot.com/o/latest.json', function(res) {
  // Get media link and pipe data to setupAll
  getRetry(res.mediaLink, drawGamesGraphs)
});

function getRetry(url, cb) {
  $.ajax({
    url: url,
    async: true,
    // retryCount and retryLimit will let you retry a determined number of times
    retryCount: 0,
    retryLimit: 5,
    // retryTimeout limits the total time retrying (in milliseconds)
    retryTimeout: 15000,
    // timeout for each request
    timeout: 2000,
    // created tells when this request was created
    created : Date.now(),
    error : function(xhr, textStatus, errorThrown ) {
      this.retryCount++;
      if (this.retryCount <= this.retryLimit && Date.now() - this.created < this.retryTimeout) {
        console.log("Retrying");
        $.ajax(this);
        return;
      }
    },
    success: cb
  });
}

function drawGamesGraphs(data){
  totalDonationsGraph(data)
}

function totalDonationsGraph(data) {
  var categories = [];
  var windows = [];
  for(var i in data.games) {
    categories.push(data.games[i].title)
    windows.push(parseInt(i));
  }
  var donationTotals = windows.map(function(start_time, idx){
    var end_time = windows.length > idx + 1 ? windows[idx + 1] : windows[windows.length - 1];
    var max_m = 0;
    var min_m = Infinity;
    for(var i in data.data){
      if(i >= start_time && i < end_time){
        if(data.data[i].m > max_m) max_m = data.data[i].m;
        if(data.data[i].m < min_m) min_m = data.data[i].m;
      }
    }
    return Math.max(0, max_m - min_m);
  });
  donationTotals.unshift('Donation Totals')
  var chart = c3.generate({
      bindto: "#totalDonationsGraph",
      data: {
          columns: [
              donationTotals
          ],
          type: 'bar',
      },
      axis: {
          x: {
              type: 'category',
              categories: categories,
              show: false
          },
          y: {
            tick: {
              format: d3.format("$,")
            }
          }
      },
      tooltip: {
        format: {
          value: function (value, ratio, id) {
            var format = d3.format('$,.2f');
            return format(value);
          }
        }
      },
  });
}