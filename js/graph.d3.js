'use strict';
var ref = new Firebase("https://sgdq-backend.firebaseio.com");


var svg, brush, games, x2, raw_data;

function adjustBrush(left, right, duration, clear){
  duration = duration || 1000;
  clear    = clear || false;
  d3.selectAll(".brush").transition()
    .duration(duration)
    .call(brush.extent([left,right]))
    .call(brush.event)
    .each('end', function() {
      // Clear brush after duration if necessary
      if(clear) setTimeout( function() {
        d3.selectAll(".brush").call(brush.clear()).call(brush);
      }, 50);
    });
}

function drawGraph(container, data){

  // Setup objects for d3 to render
  var margin = {top: 20, right: 75, bottom: 30, left: 50},
    width = $(container).width() - margin.left - margin.right,
    height = $(container).height() - 75 - margin.top - margin.bottom,
    margin2 = {top: height + 50, right: 10, bottom: 35, left: 0},
    height2 = $(container).height() - margin2.top - margin2.bottom;

  var x = d3.time.scale()
      .range([0, width]);

  x2 = d3.time.scale()
      .range([0, width]);

  var y0 = d3.scale.linear()
      .range([height, 0]);

  var y1 = d3.scale.linear()
      .range([height, 0]);

  var y3 = d3.scale.linear()
      .range([height2, 0])

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var xAxis2 = d3.svg.axis()
      .scale(x2)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y0)
      .orient("left");

  var donationAxis = d3.svg.axis()
      .scale(y1)
      .orient("right")
      .tickFormat(function(d) { return '$' + d3.format(",.0f")(d) });

  var viewerLine = d3.svg.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y0(d.viewers); })
      .defined(function(d) { return d.date > 0 && d.viewers > 0 })
      .interpolate("monotone");

  var donationLine = d3.svg.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y1(d.donations); })
      .defined(function(d) { return d.date > 0 && d.donations > 0 })
      .interpolate("basis");

  var brushLine = d3.svg.line()
      .x(function(d) { return x2(d.date); })
      .y(function(d) { return y3(d.viewers); })
      .defined(function(d) { return d.date > 0 && d.viewers > 0 })
      .interpolate("basis");

  svg = d3.select(container).append("div")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom + height2 + margin2.bottom + margin2.top)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var context = svg.append("g")
      .attr("class", "context")
      .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

  // Actually pull down JSON data and do the graph render
  games = data.games;
  data = data.data;
  var data_copy = [];
  var data_val;
  // Condition data
  for(var key in data) {
    // Ignore null viewer counts
    if(data[key].v < 0){
      continue;
    }
    data_val = {
      viewers: data[key].v,
      donators: data[key].d,
      donations: data[key].m,
      date: key
    };
    if(data_val.donations == undefined) {
      data_val.donations = -1;
    }
    data_copy.push(data_val);
  }

  // Condition games
  var games_arr = [];
  var g;
  for(var key in games) {
    g = games[key];
    g.start_time = parseInt(g.start_time);
    games_arr.push(g)
  }
  games = games_arr;

  raw_data = data_copy;
  data = raw_data;

  function inDomainX(d) {
    return d.date < x.domain()[1].getTime() && d.date > x.domain()[0].getTime()
  }

  function numPointsInDomain(){
    var loBound = binarySearch(raw_data, {date: x.domain()[0]}, function(a, b){ return a.date - b.date });
    var hiBound = binarySearch(raw_data, {date: x.domain()[1]}, function(a, b){ return a.date - b.date });
    return [hiBound - loBound, loBound, hiBound];
  }

  function resample(){
    var res = numPointsInDomain()
    var dataPerPixel = res[0]/width;
    var lo = Math.max([res[1] - 5, 0]);
    return raw_data.slice(lo, res[2] + 5).filter(
      function(d, i) { return i % Math.ceil(dataPerPixel) == 0 && inDomainX(d); }
    );
  }

  function brushed() {
    x.domain(brush.empty() ? x2.domain() : brush.extent());
    data = resample();
    y0.domain(d3.extent(data, function(d) { return d.viewers; }));
    y1.domain(d3.extent(data, function(d) { return d.donations; }));
    svg.select(".line.viewerLine").datum(data).attr("d", viewerLine);
    svg.select(".line.donationLine").datum(data).attr("d", donationLine)
    svg.select(".x.axis.top").call(xAxis);
    svg.select(".y.axis.leftAxis").call(yAxis);
    svg.select(".y.axis.rightAxis").call(donationAxis);
    lineGroup.selectAll('.line').data(games)
      .attr("x1", function(d) { return x(d.start_time)} )
      .attr("x2", function(d) { return x(d.start_time)} )
  }

  brush = d3.svg.brush()
    .x(x2)
    .on("brush", brushed);

  x.domain(d3.extent(data, function(d) { return d.date; }));
  x2.domain(x.domain());
  y0.domain(d3.extent(data, function(d) { return d.viewers; }));
  y1.domain(d3.extent(data, function(d) { return d.donations; }));
  y3.domain(y0.domain());

  data = resample();

  svg.append("g")
      .attr("class", "x axis top")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis leftAxis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Viewers");

  svg.append("path")
      .datum(data)
      .attr("class", "line viewerLine")
      .attr("d", viewerLine);

  svg.append("path")
      .datum(data)
      .attr("class", "line donationLine")
      .attr("d", donationLine);

  svg.append("g")
      .attr("class", "y axis rightAxis")
      .attr("transform", "translate(" + width + " ,0)")
      .call(donationAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -6)
      .attr("dy", ".6 0em")
      .style("text-anchor", "end")
      .text("Donations");

  var lineGroup = svg.append("g");

  lineGroup.selectAll('g').data(games).enter().append("line")
      .attr("class", "line gameLine")
      .attr("x1", function(d) { return x(d.start_time)} )
      .attr("x2", function(d) { return x(d.start_time)} )
      .attr("y1", height - 8)
      .attr("y2", height);

  context.append("path")
    .datum(data)
    .attr("class", "line contextLine")
    .attr("d", brushLine);

  context.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height2 + ")")
    .call(xAxis2);

  context.append("g")
    .attr("class", "x brush")
    .call(brush)
  .selectAll("rect")
    .attr("y", -6)
    .attr("height", height2 + 7);

  context.append("rect")
    .attr("class", "contextBound")
    .attr("width", width)
    .attr("height", height2 + 7)
    .attr("transform", "translate(0,-6)");

  svg.append("defs").append("clipPath")
      .attr("id", "clip")
    .append("rect")
      .attr("width", width)
      .attr("height", height + 10)
      .attr("transform", "translate(0,-5)");

  var focusLineG = svg.append('g')
    .attr('class', 'focusline');
  var focusLine = focusLineG.append('line')
    .style('display', 'none')
    .style('stroke', '#bbb');

  var viewerFocus = svg.append("g")
      .style("display", "none")
  viewerFocus.append("circle")
      .attr("r", 3)
      .attr("class", "viewerFocus");

  var donationFocus = svg.append("g")
      .style("display", "none");
  donationFocus.append("circle")
      .attr("r", 3)
      .attr("class", "donationFocus");
  
  svg.append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height)
    .on("mouseover", function() { 
      viewerFocus.style("display", null);
      donationFocus.style("display", null);
      focusLine.style("display", null);
      tip.style("display", null);
    })
    .on("mouseout", function() { 
      viewerFocus.style("display", "none");
      donationFocus.style("display", "none");
      focusLine.style("display", "none");
      tip.style("display", "none");
    })
    .on("mousemove", mousemove)
    .on("click", click);

  var tip = d3.select(container).append('div')
    .attr('class', 'tooltip')
    .style("border", 'none')
    .html("<div class='tool-game'></div>" + 
      "<div class='tool-date'></div>" +
      "<div class='tool-viewers'></div>" + 
      "<div class='tool-donations'></div>" + 
      "<div class='tool-footer'>Click to toggle zoom.</div>")
    .style('display', 'none');

  var toolTitle = $(".tool-game");
  var toolDate = $(".tool-date");
  var toolViewers = $(".tool-viewers");
  var toolDonatinons = $(".tool-donations");

  var bisectDate = d3.bisector(function(d) { return d.date; }).left;
  var bisectStarttime = d3.bisector(function(d) { return d.start_time; }).left;
  function mousemove() {
    var x0 = x.invert(d3.mouse(this)[0]),
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = d1 === undefined ?  d0 : (x0 - d0.date > d1.date - x0 ? d1 : d0);
    var gi = bisectStarttime(games, x0, 1),
        g = games[gi - 1];
    viewerFocus.attr("transform", "translate(" + x(d.date) + "," + y0(d.viewers) + ")");
    donationFocus.attr("transform", "translate(" + x(d.date) + "," + y1(d.donations) + ")");

    focusLine
      .attr('x1', x(d.date))
      .attr('x2', x(d.date))
      .attr('y1', 0)
      .attr('y2', height)
      .attr('display', null);
    var comma = d3.format(",.0f");

    // Update tooltip text
    toolTitle.text((d.date < g.start_time) ? "" : g.title);
    toolDate.text(moment(parseInt(d.date)).format('llll'));
    toolViewers.text("Viewers: " + comma(d.viewers));
    toolDonatinons.text("Donations: $" + comma(d.donations))

    tip.style("left", (d3.event.pageX + 20) + "px")
      .style("text-alight", "left")
      .style("top", (d3.event.pageY - 20) + "px")
      .style("border", null);
  }
  function click() {
    var x0 = x.invert(d3.mouse(this)[0]);
    var gi = bisectStarttime(games, x0, 1);
    adjustToGame(gi - 1);
  }

  renderGames();
}

function adjustToGame(i) {
  var left = games[i].start_time;
  // Bail if game hasn't started yet
  if(left > raw_data[raw_data.length - 1].date) return;

  // Set 'end' time to last data point if we are zooming to last game in list
  var right = (i + 1 < games.length && games[i+1].start_time <= raw_data[raw_data.length - 1].date) ? games[i+1].start_time : raw_data[raw_data.length - 1].date;
  // Open up brush if it's empty
  if(brush.empty()) {
    adjustBrush(x2.domain()[0], x2.domain()[1], 0);
  }
  // Zoom out if already zoomed in
  else if (brush.extent()[0] == left && brush.extent()[1] == right){
    left = x2.domain()[0];
    right = x2.domain()[1];
    adjustBrush(left, right, 1000, true);
    return;
  }
  adjustBrush(left, right); 
}

// Performance ++
function binarySearch(ar, el, compare_fn) {
    var m = 0;
    var n = ar.length - 1;
    while (m <= n) {
        var k = (n + m) >> 1;
        var cmp = compare_fn(el, ar[k]);
        if (cmp > 0) {
            m = k + 1;
        } else if(cmp < 0) {
            n = k - 1;
        } else {
            return k;
        }
    }
    return m + 1;
}

function renderGames(){
  var elm = $("<table id='gamesTable'>");
  elm.append("<thead><tr>" + 
    "<th style='width:5px'></th>" + 
    "<th style='width:340px'>Title</th>" + 
    "<th style='width:340px'>Runner</th>" + 
    "<th style='width:140px'>Starting Time</th>" + 
    "<th>Duration</th>" + 
    "</tr></thead><tbody>")
  for(var i in games){
    elm.append("<tr class='gameSelector' id='" + i + "'>" + 
      "<td style='width:5px'></td>" + 
      "<td style='width:340px' id ='" + i + "'>" + games[i].title + "</td>" + 
      "<td style='width:340px' id ='" + i + "'>" + games[i].runner + "</td>" + 
      "<td style='width:140px' id ='" + i + "'>" + moment(parseInt(games[i].start_time)).format("MMM D, h:mm a") + " " + 
      (parseInt(games[i].start_time) < (new Date()).getTime() ? "✓" : "") + "</td>" + 
      "<td id ='" + i + "'>" + games[i].duration + "</td>" + 
      "</tr>")
  }
  elm.append("</tbody>")
  $("#game-list").append(elm);
  $('.gameSelector').on("click", function(e){
    var idx = parseInt(e.toElement.id);
    adjustToGame(idx);
    if(parseInt(games[idx].start_time) < (new Date()).getTime()) {
      $(this).toggleClass("selected").siblings().removeClass("selected");
      $(this).get(0).scrollIntoView();
      $("#chart-div").get(0).scrollIntoView();
    }
  });
}

ref.once("value", function(res) {
  drawGraph("#chart", res.val());
});