//Width and height
var w = 1000;
var h = 600;
var padding = 30;


//Define Data Range
var dataset = [];
//Import csv Data
//引用数据data内容至全局数据dataset[]
d3.csv("../Data/Money.csv", function(error, data) {
	if (error) {
		console.log(error);
	} else {
		console.log(data);
	}
	for (var i = 0; i < data.length; i++) {
		var year = data[i].year;
		var quarter = data[i].quarter;
		var month = data[i].month;
		var day = data[i].day;
		var toll = parseFloat(data[i].toll);
		var volume = parseFloat(data[i].volume);
		// console.log("year: " + year + "\n" +  "quarter: " + quarter + "\n" +  "month: " + month+ "\n" + "day: " + day+ "\n" + "toll: " + toll+ "\n" + "volume: " + volume 
		//           );
		dataset.push([toll, volume]);
	}
	console.log(dataset);



	//Create scale functions
	var xScale = d3.scale.linear()
		.domain([0, d3.max(dataset, function(d) {
			return d[0];
		})])
		.range([padding, w - padding * 2]);
	var yScale = d3.scale.linear()
		.domain([0, d3.max(dataset, function(d) {
			return d[1] / 1000;
		})])
		.range([h - padding, padding]);
	var rScale = d3.scale.linear()
		.domain([0, d3.max(dataset, function(d) {
			return d[0];
		})])
		.range([0, 10]);
	var formatAsPercentage = d3.format(".1%");

	//Define X axis
	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom")
		.ticks(5);
	//Define Y axis	
	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left")
		.ticks(5);
	//Create SVG element
	var svg = d3.select("body")
		.append("svg")
		.attr("width", w)
		.attr("height", h);
	//Create circle
	svg.selectAll("circle")
		.data(dataset)
		.enter()
		.append("circle")
		.attr("cx", function(d) {
			return xScale(d[0]);
		})
		.attr("cy", function(d) {
			return yScale(d[1] / 1000);
		})
		.attr("r", function(d) {
			return rScale(d[0]);
		})
		.attr("fill", "pink");
	//Create X axis
	svg.append("g")
		.attr("class", "x Axis")
		.attr("transform", "translate(0," + (h - padding) + ")")
		.call(xAxis);
	//Create Y axis
	svg.append("g")
		.attr("class", "y Axis")
		.attr("transform", "translate(" + padding + ",0)")
		.call(yAxis);
	//Create labels
	svg.selectAll("text")
		.data(dataset)
		.enter()
		.append("text")
		.text(function(d) {
			return d[0] + "," + d[1] / 1000;
		})
		.attr("text-anchor", "middle")
		.attr("x", function(d) {
			return xScale(d[0]);
		})
		.attr("y", function(d) {
			return yScale(d[1] / 1000);
		})
		.attr("font-family", "sans-serif")
		.attr("font-size", "11px")
		.attr("fill", "yellow");
}); //将前面内容放到代码尾部