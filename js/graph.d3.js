'use strict';

var svg, brush, games, x2, tot_data;

function adjustToLast(ms) {
  var now = new Date();
  if (now - ms < tot_data[0].date) {
    openBrush({clearAtEnd: true});
  }
  else {
    adjustBrush(now - ms, now);    
  }
}

function adjustBrush(left, right, duration, clear){
  /**
   * Adjusts brush with animation
   */
  left = new Date(left)
  right = new Date(right)
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
        $('.gameSelector').siblings().removeClass("selected");
      }, 50);
    });
}

function openBrush(opts) {
  var left = x2.domain()[0];
  var right = x2.domain()[1];
  var duration = opts.duration || 1000
  var clearAtEnd = opts.clearAtEnd || false
  adjustBrush(left, right, duration, clearAtEnd);
}

// Data Schema:
//   data => Array of objects (d)
//              - d.primVal => Blue Series w/ Left axis
//              - d.secVal  => Red  Series w/ Right axis
function drawGraph(container, data, primFormat, secFormat, 
  primName, secName){
  /**
   * Renders graph into the container
   */

  d3.select(container).selectAll("div").remove();

  // Setup objects for d3 to render
  var margin = {top: 20, right: 75, bottom: 30, left: 75},
    width = $(container).width() - margin.left - margin.right,
    height = $(container).height() - 75 - margin.top - margin.bottom,
    margin2 = {top: height + 50, right: 10, bottom: 35, left: 0},
    height2 = $(container).height() - margin2.top - margin2.bottom;

  // Check old brush settings if they exist
  var extent = undefined;
  var pushRight = false;
  if(brush && !brush.empty() && brush.extent()) {
    extent = brush.extent();
    if(x2 && x2.domain() && (x2.domain()[1].toString() === extent[1].toString() ||
      x2.domain()[1].getTime().toString() == extent[1])) pushRight = true;
  }

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

  var y4 = d3.scale.linear()
      .range([height2, 0])

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var xAxis2 = d3.svg.axis()
      .scale(x2)
      .orient("bottom");

  var y0Axis = d3.svg.axis()
      .scale(y0)
      .orient("left")
      .tickFormat(function(d) { return  primFormat(d) });

  var y1Axis = d3.svg.axis()
      .scale(y1)
      .orient("right")
      .tickFormat(function(d) { return  secFormat(d) });

  var primaryLine = d3.svg.line()
      .defined(function(d) { return d.date > 0 && d.primVal >= 0 })
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y0(d.primVal); })
      .interpolate("monotone");

  var secondaryLine = d3.svg.line()
      .defined(function(d) { return d.date > 0 && d.secVal >= 0 })
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y1(d.secVal); })
      .interpolate("monotone");

  var primBrushLine = d3.svg.line()
      .defined(function(d) { return d.date > 0 && d.primVal >= 0 })
      .x(function(d) { return x2(d.date); })
      .y(function(d) { return y3(d.primVal); })
      .interpolate("basis");

  var secBrushLine = d3.svg.line()
      .defined(function(d) { return d.date > 0 && d.secVal >= 0 })
      .x(function(d) { return x2(d.date); })
      .y(function(d) { return y4(d.secVal); })
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

  function inDomainX(d) {
    return d.date < x.domain()[1].getTime() && d.date > x.domain()[0].getTime()
  }

  function numPointsInDomain(){
    var loBound = binarySearch(tot_data, {date: x.domain()[0]}, function(a, b){ return a.date - b.date });
    var hiBound = binarySearch(tot_data, {date: x.domain()[1]}, function(a, b){ return a.date - b.date });
    return [hiBound - loBound, loBound, hiBound];
  }

  function resample(){
    var res = numPointsInDomain()
    var dataPerPixel = res[0]/width;
    var lo = Math.max([res[1] - 5, 0]);
    return tot_data.slice(lo, res[2] + 5).filter(
      function(d, i) { return i % Math.ceil(dataPerPixel) == 0 && inDomainX(d); }
    );
  }

  function brushed() {
    x.domain(brush.empty() ? x2.domain() : brush.extent());
    data = resample();
    y0.domain(d3.extent(data, function(d) { return d.primVal >= 0 ? d.primVal : NaN; }));
    y1.domain(d3.extent(data, function(d) { return d.secVal  >= 0 ? d.secVal  : NaN; }));
    svg.select(".line.primaryLine").datum(data).attr("d", primaryLine);
    svg.select(".line.secondaryLine").datum(data).attr("d", secondaryLine)
    svg.select(".x.axis.top").call(xAxis);
    svg.select(".y.axis.leftAxis").call(y0Axis);
    svg.select(".y.axis.rightAxis").call(y1Axis);
    lineGroup.selectAll('.line').data(games)
      .attr("x1", function(d) { return x(d.start_time)} )
      .attr("x2", function(d) { return x(d.start_time)} )
  }

  brush = d3.svg.brush()
    .x(x2)
    .on("brush", brushed)
    .on("brushend", function(){
      $('.gameSelector').siblings().removeClass("selected");
    })
    .clear();

  x.domain(d3.extent(data, function(d) { return d.date; }));
  x2.domain(x.domain());
  
  data = resample();
  y0.domain(d3.extent(data, function(d) { return d.primVal >= 0 ? d.primVal : NaN; }));
  y1.domain(d3.extent(data, function(d) { return d.secVal  >= 0 ? d.secVal  : NaN; }));
  y3.domain(y0.domain());
  y4.domain(y1.domain());

  svg.append("g")
      .attr("class", "x axis top")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis leftAxis")
      .call(y0Axis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(primName);

  svg.append("path")
      .datum(data)
      .attr("class", "line primaryLine")
      .attr("d", primaryLine);

  svg.append("path")
      .datum(data)
      .attr("class", "line secondaryLine")
      .attr("d", secondaryLine);

  svg.append("g")
      .attr("class", "y axis rightAxis")
      .attr("transform", "translate(" + width + " ,0)")
      .call(y1Axis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -6)
      .attr("dy", ".6 0em")
      .style("text-anchor", "end")
      .text(secName);

  var lineGroup = svg.append("g");

  lineGroup.selectAll('g').data(games).enter().append("line")
      .attr("class", "line gameLine")
      .attr("x1", function(d) { return x(d.start_time)} )
      .attr("x2", function(d) { return x(d.start_time)} )
      .attr("y1", height - 8)
      .attr("y2", height);

  context.append("path")
    .datum(data)
    .attr("class", "line primContextLine")
    .attr("d", primBrushLine);

  context.append("path")
    .datum(data)
    .attr("class", "line secContextLine")
    .attr("d", secBrushLine);

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

  var primaryFocus = svg.append("g")
      .style("display", "none")
  primaryFocus.append("circle")
      .attr("r", 3)
      .attr("class", "primaryFocus");

  var secondaryFocus = svg.append("g")
      .style("display", "none");
  secondaryFocus.append("circle")
      .attr("r", 3)
      .attr("class", "secondaryFocus");
  
  svg.append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height)
    .on("mouseover", function() { 
      primaryFocus.style("display", null);
      secondaryFocus.style("display", null);
      focusLine.style("display", null);
      tip.style("display", null);
    })
    .on("mouseout", function() { 
      primaryFocus.style("display", "none");
      secondaryFocus.style("display", "none");
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
      "<div class='tool-primary'></div>" + 
      "<div class='tool-secondary'></div>" + 
      "<div class='tool-footer'>Click to toggle zoom.</div>")
    .style('display', 'none');

  var toolTitle = $(".tool-game");
  var toolDate = $(".tool-date");
  var toolPrimary = $(".tool-primary");
  var toolSecondary = $(".tool-secondary");

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

    if(d.primVal >= 0) {
      primaryFocus.attr("transform", "translate(" + x(d.date) + "," + y0(d.primVal) + ")")
        .attr('display', null);
    } else{
      primaryFocus.attr('display', 'none')
    }

    if(d.secVal >= 0){
      secondaryFocus.attr("transform", "translate(" + x(d.date) + "," + y1(d.secVal) + ")")
        .attr('display', null);
    } else {
      secondaryFocus.attr('display', 'none')
    }

    focusLine
      .attr('x1', x(d.date))
      .attr('x2', x(d.date))
      .attr('y1', 0)
      .attr('y2', height)
      .attr('display', null);

    // Update tooltip text
    toolTitle.text((d.date < g.start_time) ? "" : g.name);
    toolDate.text(moment(parseInt(d.date)).format('llll'));
    toolPrimary.text(primName + ": " + (d.primVal >= 0 ? primFormat(d.primVal) : "No data"));
    toolSecondary.text(secName + ": " + (d.secVal >= 0 ? secFormat(d.secVal) : "No data"));

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

  d3.select(container).selectAll("img").remove();

  if(extent) {
    // Push to newest data point if we were already at the right-most edge
    adjustBrush(extent[0], pushRight ? x2.domain()[1] : extent[1], 1, false);
  }
}

function adjustToGame(i) {
  var left = new Date(games[i].start_time);
  // Bail if game hasn't started yet
  if(left > tot_data[tot_data.length - 1].date) return;
  // Set 'end' time to last data point if we are zooming to last game in list
  var right = new Date((i + 1 < games.length && games[i+1].start_time <= tot_data[tot_data.length - 1].date) ? games[i+1].start_time : tot_data[tot_data.length - 1].date);
  // Open up brush if it's empty
  if(brush.empty()) {
    openBrush({duration: 0})
  }
  // Zoom out if already zoomed in
  else if (brush.extent()[0].getTime() == left.getTime() && brush.extent()[1].getTime() == right.getTime()){
    openBrush({clearAtEnd: true})
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
  var curr = 0;
  for(var i in games){
    var fullText = "<tr class='gameSelector' id='" + i + "'>" +
      "<td style='width:5px'></td>" + 
      "<td style='width:340px' id ='" + i + "'>" + games[i].name + "</td>" +
      "<td style='width:340px' id ='" + i + "'>" + games[i].runners + "</td>";
    var durationText = moment(parseInt(games[i].start_time)).format("MMM D, h:mm a") + " " +
      (parseInt(games[i].start_time) < (new Date()).getTime() ? "✓" : "");
    fullText += "<td class='" + i + "duration' style='width:140px' id ='" + i + "'>" + durationText + "</td>";
    fullText += "<td id ='" + i + "'>" + games[i].duration + "</td></tr>";
    elm.append(fullText)
    if(parseInt(games[i].start_time) < (new Date()).getTime()) curr += 1;
    // Register callback to add check mark when next games has started
    if(parseInt(games[i].start_time) >= (new Date()).getTime()) {
      setTimeout(function(d){
        $("." + d + "duration").first().text(moment(parseInt(games[d].start_time)).format("MMM D, h:mm a") + " ✓");
      }, parseInt(games[i].start_time) - (new Date()).getTime(), i);
    }
  }
  elm.append("</tbody>")
  $("#game-list").append(elm);
  // Setup click responders
  $('.gameSelector').on("click", function(e){
    var idx = parseInt(e.toElement.id);
    adjustToGame(idx);
    if(parseInt(games[idx].start_time) < (new Date()).getTime()) {
      $(this).toggleClass("selected").siblings().removeClass("selected");
      $(this).get(0).scrollIntoView();
      $("#chart-div").get(0).scrollIntoView();
    }
  });
  var table = $('#game-list')
  var curr_row = $('#' + (curr - 1));
  if(curr_row.get(0)) {
    curr_row.get(0).scrollIntoView();
    window.scrollTo(0, 0);
  }
}

function conditionData(fb_data, primKey, secKey) {
  var data_copy = [];
  var data_val;
  // Condition data
  for(var key in fb_data) {
    data_val = {
      primVal: fb_data[key][primKey],
      secVal: fb_data[key][secKey],
      date: parseInt(key)
    };
    if(data_val.primVal >= 0 || data_val.secVal >= 0) data_copy.push(data_val);
  }
  data_copy = data_copy.sort(function(a,b) { return a.date - b.date })
  tot_data = data_copy;
  return data_copy;
}

function conditionGames(games_input) {
  var games_arr = [];
  var g;
  for(var key in games_input) {
    g = games_input[key];
    g.start_time = Date.parse(g.start_time);
    games_arr.push(g)
  }
  games_arr = games_arr.sort(function(a, b) { return a.start_time - b.start_time })
  games = games_arr;
}

var seriesMap = {
  "Viewers": { key: 'v', format: d3.format(",.0f") },
  "Donations": { key: 'm', format: d3.format("$,.0f") },
  "Donations per Minute": { key: 'dpm', format: d3.format("$,.0f") },
  "Donators": { key: 'd', format: d3.format(",.0f") },
  "Tweets": { key: 'tt', format: d3.format(",.0f") },
  "Tweets per Minute": { key: 't', format: d3.format(",.0f") },
  "Twitch Chats": { key: 'ct', format: d3.format(",.0f") },
  "Twitch Chats per Minute": { key: 'c', format: d3.format(",.0f") },
  "Twitch Emotes": { key: 'et', format: d3.format(",.0f") },
  "Twitch Emotes per Minute": { key: 'e', format: d3.format(",.0f") },
  "Disabled": { key: 'l', format: d3.format() }
}

function selectChanged(){
  var sel1 = $("#primSelect"),
      sel2 = $("#secSelect"),
      sel1val = sel1.find(":selected").text(),
      sel2val = sel2.find(":selected").text();
  sel1.find("option").prop('disabled', false);
  sel2.find("option").prop('disabled', false);
  sel1.find("option[value='" + sel2val + "']").prop('disabled', true);
  sel2.find("option[value='" + sel1val + "']").prop('disabled', true);
  Cookies.set('sel1', sel1val);
  Cookies.set('sel2', sel2val);
  render(sel1val, sel2val);
}

var raw_data;
function render(series1, series2) {
  var ser1 = seriesMap[series1];
  var ser2 = seriesMap[series2];
  if(series1 == "Disabled") series1 = "";
  if(series2 == "Disabled") series2 = "";
  var conditionedData = conditionData(raw_data, ser1.key, ser2.key);
  drawGraph("#chart", conditionedData, ser1.format, 
    ser2.format, series1, series2);
}

function generateSyntheticSeries(input){ 
  var prev   = undefined,
      tweets = 0,
      chats  = 0,
      emotes = 0;
  var key, keys = Object.keys(input);
  keys = keys.sort();
  for(var i = 0; i < keys.length; i++){
    key = keys[i];
    // Tweet Total
    if(input[key].t) tweets += input[key].t;
    input[key].tt = tweets;
    // Chat Total
    if(input[key].c) chats += input[key].c;
    input[key].ct = chats;
    // Emote Total
    if(input[key].e) emotes += input[key].e;
    input[key].et = emotes;

    if(!prev) {
      prev = key;
      input[key].dpm = 0;
      continue;
    }
    // Donations per Minute
    if(input[key].m >= 0){
      input[key].dpm = input[key].m - input[prev].m
      prev = key;
    }
    if(!input[key].dpm || input[key].dpm < 0) input[key].dpm = 0;
  }
  return input;
}

function loadSelectCookies() {
  var sel1val = Cookies.get('sel1'),
      sel2val = Cookies.get('sel2');
  if(sel1val){
    $("#primSelect").find("option[value='" + sel1val + "']").prop('selected', true);
  }
  if(sel2val){
    $("#secSelect").find("option[value='" + sel2val + "']").prop('selected', true);
  }
}


function initialSetup() {
  raw_data = generateSyntheticSeries(raw_data);
  loadSelectCookies();
  selectChanged();
  renderGames();
}

var shouldRerender = false;

function handleTimeseries(ts) {
  var data = {}
  for(var i = 0; i < ts.length; i ++){
    var key = Date.parse(ts[i].time)
    data[key] = ts[i]
  }
  raw_data = data
  shouldRerender = true
}

function handleSchedule(sched) {
  conditionGames(sched);
}

DBConnection.getTimeseries().then(function(ts){
  handleTimeseries(ts)
  // console.log('got ts')
  DBConnection.getSchedule().then(function(sched){
    // console.log('got sched')
    handleSchedule(sched)
    initialSetup()
    DBConnection.timeseriesListeners.push(handleTimeseries)
    DBConnection.scheduleListeners.push(handleSchedule)
  })
})


setInterval(function() {
  // Rerender
  if(shouldRerender) {
    raw_data = generateSyntheticSeries(raw_data);
    selectChanged();
    shouldRerender = false;
  }
}, 10 * 1000)
