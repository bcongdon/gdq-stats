var jsonSouce = "https://sgdq-backend.firebaseio.com/data.json"

function drawGraph(container){
  'use strict';

  // Setup objects for d3 to render
  var margin = {top: 20, right: 75, bottom: 30, left: 50},
    width = $(container).width() - margin.left - margin.right,
    height = $(container).height() - margin.top - margin.bottom;

  var x = d3.time.scale()
      .range([0, width]);

  var y0 = d3.scale.linear()
      .range([height, 0]);

  var y1 = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y0)
      .orient("left");

  var donationAxis = d3.svg.axis()
      .scale(y1)
      .orient("right")
      .tickFormat(function(d) { return '$' + d3.format(",.0f")(d) });;

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

  var svg = d3.select(container).append("div")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
    y0.domain(d3.extent(data, function(d) { return d.viewers; }));
    y1.domain(d3.extent(data, function(d) { return d.donations; }));

    svg.append("g")
        .attr("class", "x axis")
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

    var focusLineG = svg.append('g')
      .attr('class', 'focusline');
    var focusLine = focusLineG.append('line')
      .style('display', 'none')
      .style('stroke', '#bbb');
    var lineg = svg.append('g').attr("pointer-events", "none").attr('opacity', 0);

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