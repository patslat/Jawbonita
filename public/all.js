var placeGraph = function(data) {
  N = data.dates.length
    , WIDTH = N * 5
    , HEIGHT = WIDTH
  ;

  var vis = d3.select('#sleep-graph').append('svg:svg')
      .attr('width', WIDTH)
      .attr('height', HEIGHT)
      .append('svg:g')
      .attr('id', 'container')
      .attr('transform', 'translate(' + WIDTH / 2 + ',' + HEIGHT / 2 + ')');
};
