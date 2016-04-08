//Width and height
var width = 700;
var height = 700;
//Define map projection
var projection = d3.geo.mercator()
	.center([width / (700 / 90), height / (700 / 42)])
	.scale(1000)
	.translate([width / 2, height / 2]);
//Define path generator:GeoJSON 坐标转换成更乱的SVG 路径代码
var path = d3.geo.path()
	.projection(function(d) {
		return projection(d);
	});
//Define quantize scale to sort data values into buckets of color
//Colors taken from colorbrewer.js, included in the D3 download
var color = d3.scale.category20c();

var svg = d3.select("body")
	.append("svg")
	.attr("width", "100%")
	.attr("height", "100%")
	.append("g")
	.attr("transform", "translate(0,0)");


d3.csv("../Data/Province.csv", function(data) {
	//Set input domain for color scale
	color.domain([
		d3.min(data, function(d) {
			return d.value / 100000;
		}),
		d3.max(data, function(d) {
			return d.value / 100000;
		})
	]);
	d3.json("../Data/china.json", function(error, json) {
		//逻辑判断返回数据
		if (error)
			return console.error(error);
		else
			console.log(json.features.length);
		//Province中的value值添加进json
		//Loop through once for each ag. data value
		for (var i = 0; i < data.length; i++) {

			var DataProvince = data[i].Provinces; //获取省名

			var DataValue = parseFloat(data[i].Value); //Grab data value, and convert from string to float	
			//Find the corresponding state inside the GeoJSON
			for (var j = 0; j < json.features.length; j++) {

				var jsonProvince = json.features[j].properties.name;

				if (DataProvince == jsonProvince) {
					//Copy the data value into the JSON
					json.features[j].properties.value = DataValue;
					//Stop looking through the JSON
					break;
				}
			}
		}

		mapareas = svg.selectAll("path")
			.data(json.features)
			.enter()
			.append("path")
			.attr("class", "area")
			.attr("stroke", "teal")
			.attr("stroke-width", 1)
			.attr("d", path)
			.style("fill", function(d, i) {
				var value = d.properties.value / 100000;
				return color(value);
			});
	});
	//画散点图
	d3.json("../Data/places.json", function(places) {
		svg.selectAll("circle")
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
				return "rgb(105, " + (d.value * 10) + ", 149)";
			})
			.style("opacity", 0.75);

	});


	//南海区域地图
	d3.xml("../Data/southchinasea.svg", function(error, xmlDocument) {
		svg.html(function(d) {
			return d3.select(this).html() + xmlDocument.getElementsByTagName("g")[0].outerHTML;
		});

		var gSouthSea = d3.select("#southsea");

		gSouthSea.attr("transform", "translate(1000,710)scale(0.7)")
			.attr("class", "southsea");

	});

});