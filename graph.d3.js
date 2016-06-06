var jsonSouce = "https://sgdq-backend.firebaseio.com/data.json"

function drawGraph(container){
  'use strict';

  // Setup objects for d3 to render
  var margin = {top: 20, right: 75, bottom: 30, left: 50},
    width = $(container).width() - margin.left - margin.right,
    height = $(container).height() - 75 - margin.top - margin.bottom,
    margin2 = {top: height + 50, right: 10, bottom: 35, left: 0},
    height2 = $(container).height() - margin2.top - margin2.bottom;

  var x = d3.time.scale()
      .range([0, width]);

  var x2 = d3.time.scale()
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

  var brush = d3.svg.brush()
    .x(x2)
    .on("brush", brushed);

  var viewerLine = d3.svg.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y0(d.viewers); })
      .defined(function(d) { return d.date > 0 && d.viewers > 0 })
      .interpolate("basis");

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

  var svg = d3.select(container).append("div")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom + height2 + margin2.bottom + margin2.top)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var context = svg.append("g")
      .attr("class", "context")
      .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

  var focus = svg.append("g")
      .attr("class", "focus")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  function brushed() {
    x.domain(brush.empty() ? x2.domain() : brush.extent());
    svg.select(".line.viewerLine").attr("d", viewerLine);
    svg.select(".line.donationLine").attr("d", donationLine)
    svg.select(".x.axis.top").call(xAxis);
  }

  // Actually pull down JSON data and do the graph render
  d3.json(jsonSouce, function(error, data) {
    var data_copy = [];
    var data_val;
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
    data = data_copy
    if (error) {
      throw error;
    }

    x.domain(d3.extent(data, function(d) { return d.date; }));
    x2.domain(x.domain());
    y0.domain(d3.extent(data, function(d) { return d.viewers; }));
    y1.domain(d3.extent(data, function(d) { return d.donations; }));
    y3.domain(y0.domain());

    svg.append("g")
        .attr("class", "x axis top")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
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
        .attr("class", "y axis")
        .attr("transform", "translate(" + width + " ,0)")
        .call(donationAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -6)
        .attr("dy", ".6 0em")
        .style("text-anchor", "end")
        .text("Donations");

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
      .attr("height", height + height2)
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
      .on("mousemove", mousemove);

    var tip = d3.select(container).append('div')
      .attr('class', 'tooltip');

    var bisectDate = d3.bisector(function(d) { return d.date; }).left;
    function mousemove() {
      var x0 = x.invert(d3.mouse(this)[0]),
          i = bisectDate(data, x0, 1),
          d0 = data[i - 1],
          d1 = data[i],
          d = x0 - d0.date > d1.date - x0 ? d1 : d0;
      viewerFocus.attr("transform", "translate(" + x(d.date) + "," + y0(d.viewers) + ")");
      donationFocus.attr("transform", "translate(" + x(d.date) + "," + y1(d.donations) + ")");

      focusLine
        .attr('x1', x(d.date))
        .attr('x2', x(d.date))
        .attr('y1', 0)
        .attr('y2', height)
        .attr('display', null);
      tip.html("Date: " + (new Date(parseInt(d.date))).toString() + "<br/>Viewers: " + d.viewers + "<br/>Donations: " + d.donations)
        .style("left", (d3.event.pageX + 20) + "px")
        .style("text-alight", "left")
        .style("top", (d3.event.pageY - 20) + "px");
    }
  });
}

drawGraph("#chart")