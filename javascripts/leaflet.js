var map = new L.Map("map", {
    center: [30.8, 110.9],
    zoom: 4
  })
  .addLayer(new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"));

var svg = d3.select(map.getPanes().overlayPane)
  .append("svg"),
  g = svg.append("g")
  .attr("class", "leaflet-zoom-hide");

//Width and height
var width = 700;
var height = 700;

//Define map projection
var projection = d3.geo.mercator()

.scale(1000)
  .translate([width / 2, height / 2]);

//Define path generator:GeoJSON 坐标转换成更乱的SVG 路径代码
var path = d3.geo.path()
  .projection(function(d) {
    return projection(d);
  });

d3.json("../Data/china.json", function(error, collection) {
  if (error) throw error;

  var transform = d3.geo.transform({
    point: projectPoint
  });
  var path = d3.geo.path()
    .projection(transform);

  var feature = g.selectAll("path")
    .data(collection.features)
    .enter()
    .append("path");
  d3.json("../Data/places.json", function(error, places) {
    var location = svg.selectAll("circle")
      .data(places.location)
      .enter()
      .append("circle")
      .attr("cx", function(d) {
        return projection([d.log, d.lat])[0];
      })
      .attr("cy", function(d) {
        return projection([d.log, d.lat])[1];
      })
      .attr("r", function(d) {
        return d.value;
      })
      .style("fill", function(d) {
        return "rgb(" + (d.value * 10) + ", " + (d.value * 50) + ", " + (d.value * 20) + ")";
      })
      .style("opacity", 0.75);
  });

  map.on("viewreset", reset);
  reset();

  // Reposition the SVG to cover the features.
  function reset() {
    var bounds = path.bounds(collection),
      topLeft = bounds[0],
      bottomRight = bounds[1];

    svg.attr("width", bottomRight[0] - topLeft[0])
      .attr("height", bottomRight[1] - topLeft[1])
      .style("left", topLeft[0] + "px")
      .style("top", topLeft[1] + "px");

    g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

    feature.attr("d", path);
  }

  // Use Leaflet to implement a D3 geometric transformation.
  function projectPoint(x, y) {
    var point = map.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
  }

});