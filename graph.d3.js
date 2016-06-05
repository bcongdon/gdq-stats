var jsonSouce = "https://sgdq-backend.firebaseio.com/something"

function drawGraph(container){
  'use strict';
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = $(container).width() - margin.left - margin.right,
    height = $(container).height() - margin.top - margin.bottom;

  var x = d3.time.scale()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var line = d3.svg.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.close); });

  var svg = d3.select(container).append("div")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var valueline = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });

  d3.tsv("data.csv", type, function(error, data) {
    if (error) {
      throw error;
    }

    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain(d3.extent(data, function(d) { return d.close; }));

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
        .attr("class", "line")
        .attr("d", line);

    var focus = svg.append("g")
        .attr("class", "focus")
        .style("display", "none")

    focus.append("circle")
        .attr("r", 4.5);

    var focusLineG = svg.append('g')
    .attr('class', 'focusline');
    var focusLine = focusLineG.append('line')
      .style('display', 'none')
      .style('stroke', '#00ADF3');
    var lineg = svg.append('g').attr("pointer-events", "none").attr('opacity', 0);

    svg.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .on("mouseover", function() { 
        focus.style("display", null);
        focusLine.style("display", null);
        tip.style("display", null);
      })
      .on("mouseout", function() { 
        focus.style("display", "none");
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
      focus.attr("transform", "translate(" + x(d.date) + "," + y(d.close) + ")");

      focusLine
        .attr('x1', x(d.date))
        .attr('x2', x(d.date))
        .attr('y1', 0)
        .attr('y2', height)
        .attr('display', null);
      tip.html("Date: " + d.date + "<br/>Close: " + d.close )
        .style("left", (d3.event.pageX + 20) + "px")
        .style("text-alight", "left")
        .style("top", (d3.event.pageY - 20) + "px");
    }
  });
}

drawGraph("#chart")

function type(d) {
  var formatDate = d3.time.format("%d-%b-%y");
  d.date = formatDate.parse(d.date);
  d.close = +d.close;
  return d;
}