$.get('/data/games.csv')
  .pipe( CSV.parse )
  .done( function(rows) {
    handleData(rows)
  });

function unique(arr) {
  return arr.filter(function (e, i, arr) {
    return arr.lastIndexOf(e) === i;
  });
}

function handleData(data) {
  var titles       = data.map(function(d) { return d[1]; }),
      runners      = data.map(function(d) { return d[2]; }),
      platforms    = data.map(function(d) { return d[3]; }),
      releaseDates = data.map(function(d) { return d[4]; }),
      minutes      = data.map(function(d) { return d[5]; }),
      platform_unique = unique(platforms);
  releaseDates.unshift('x');
  releaseDates = releaseDates.map(function(d) {return d == "" ? null : d;})
  var columns = [releaseDates];
  for(var i in platform_unique) {
    var newCol = data.map(function(d) { return d[3] == platform_unique[i] ? d[5] : null});
    newCol.unshift(platform_unique[i])
    columns.push(newCol)
  }
  console.log(columns.filter(function(d) { return d[0] == "SNES"}))
  console.log(releaseDates)
  var chart = c3.generate({
      bindto: '#schedule_chart',
      data: {
          x: 'x',
          columns: columns,
          type: 'scatter'
      },
      axis: {
          x: {
              label: 'Release Date',
              tick: {
                  format: '%Y',
                  fit: false
              },
              type: 'timeseries'
          },
          y: {
              label: 'SGDQ Speedrun Time',
              min: 0,
              max: 250,
              padding: {top: 0, bottom: 0}
          }
      },
      point: {
        r: 3
      },
      tooltip: {
        format: {
          title: function(d) { 
            var date = moment(d).format('YYYY-MM-DD');
            return titles[releaseDates.lastIndexOf(date) - 1] + '<br><span style="color:#000;font-weight:200">' + date + '</span>';
          },
          value: function(value, ratio, id) { return value + ' minutes' }
        },
        contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
          var $$ = this, config = $$.config,
              titleFormat = config.tooltip_format_title || defaultTitleFormat,
              nameFormat = config.tooltip_format_name || function (name) { return name; },
              valueFormat = config.tooltip_format_value || defaultValueFormat,
              text, i, title, value, name, bgcolor;
          for (i = 0; i < d.length; i++) {
              if (! (d[i] && (d[i].value || d[i].value === 0))) { continue; }

              if (! text) {
                  title = titleFormat ? titleFormat(d[i].x) : d[i].x;
                  text = "<table class='" + $$.CLASS.tooltip + "'>" + (title || title === 0 ? "<tr><th colspan='2' style='background-color:#ddd; color:black; font-family:Open Sans'>" + title + "</th></tr>" : "");
              }

              name = nameFormat(d[i].name);
              value = valueFormat(d[i].value, d[i].ratio, d[i].id, d[i].index);
              bgcolor = $$.levelColor ? $$.levelColor(d[i].value) : color(d[i].id);

              text += "<tr class='" + $$.CLASS.tooltipName + "-" + d[i].id + "'>";
              text += "<td class='name'><span style='background-color:" + bgcolor + "'></span>" + name + "</td>";
              text += "<td class='value'>" + value + "</td>";
              text += "</tr>";
          }
          return text + "</table>";
        }
      }
  });
}