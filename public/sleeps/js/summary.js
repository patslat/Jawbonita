$(function() {
  var N = data.length
    , SVG_WIDTH = N * 50
    , SVG_HEIGHT = N * 2
    , BAR_HEIGHT_MULTIPLIER = 50
    , BAR_WIDTH = 45
    , BOTTOM_PADDING = 80
    , LEFT_PADDING = 40
    , BAR_DISTANCE = 80
    , SINCE = _(data).last().date
    , UNTIL = _(data).first().date
  ;

  var parseDt = function(date) {
        var dateStr = String(date)
        return new Date(dateStr.slice(0, 4), dateStr.slice(4, 6), dateStr.slice(6, 8));
      }
      domain = _(data).map(function(d) { return parseDt(d.date); })
  ;

  var barHeight = function(d, i) { return durationToHours(d.duration) * BAR_HEIGHT_MULTIPLIER; }
    , barX = function(d, i) {
        // We subtract half of the width so the ticks align with the bar's center
        return LEFT_PADDING + xScale(parseDt(d.date)) - (BAR_WIDTH / 2);
      }
    , barY = function(d, i) { return SVG_HEIGHT - barHeight(d, i) - BOTTOM_PADDING; }
    , durationToHours = function(duration) { return duration / 60 / 60; }
    , redness = function(duration) {
        hours = durationToHours(duration)
        return Math.round(255 - ((hours / 8) * 255));
      }
    , blueness = function(duration) {
        hours = durationToHours(duration)
        return Math.round((hours / 8) * 255);
      }
    , barFill = function(d, i) {
        return 'rgb(' + redness(d.duration) + ', 0, ' + blueness(d.duration) + ')';
      }
  ;

  var svg = d3.select('#sleep-graph').append('svg:svg')
    .attr('width', SVG_WIDTH + 'px')
    .attr('height', SVG_HEIGHT + 'px')
  ;

  var container = svg.append('svg:g');

  var xScale = d3.time.scale()
    .domain([_(domain).first(), _(domain).last()])
    .rangeRound([LEFT_PADDING, SVG_WIDTH])
  ;

  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .ticks(d3.time.days, 1)
    .innerTickSize(20)
    .outerTickSize(1)
    .tickPadding(5)
  ;

  var bars = container.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
  ;

  bars.attr('x', barX)
  .attr('y', barY)
  .attr('height', barHeight)
  .attr('width', BAR_WIDTH)
  .attr('fill', barFill)

  svg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(' + LEFT_PADDING + ',' + (SVG_HEIGHT - BOTTOM_PADDING) + ")")
    .call(xAxis)
    .selectAll('text')
      .style('text-anchor', 'end')
      .style('dx', '-.8em')
      .style('dy', '.15em')
      .attr('transform', 'rotate(-65) translate(-25, -' + BAR_WIDTH / 2  + ')')
  ;
});
