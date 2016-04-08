var width = 700,
    height = 700;

//进行经纬度转换
var projection = d3.geo.mercator()
    .center([107, 31])
    .scale(600)
    .translate([width / 2, height / 2]);
//地图绘制函数   
var path = d3.geo.path()
    .projection(projection);
//创建比例尺返回地图颜色定义
var color = d3.scale.quantize()
    .range([
        "rgb(237,248,233)",
        "rgb(186,228,19)",
        "rgb(116,16,118)",
        "rgb(49,163,184)",
        "rgb(0,109,44)"
    ]);

//创建svg元素
var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

//绘制地图   
d3.json("../Data/china.topojson", function(error, toporoot) {
    if (error)
        return console.error(error);
    else
    //输出china.topojson的对象
        console.log(toporoot);

    //将TopoJSON对象转换成GeoJSON，保存在georoot中
    var georoot = topojson.feature(toporoot, toporoot.objects.china);

    //输出GeoJSON对象
    console.log(georoot);

    //包含中国各省路径的分组元素
    var china = svg.append("g");

    //添加中国各种的路径元素
    var provinces = china.selectAll("path")
        .data(georoot.features)
        .enter()
        .append("path")
        .attr("class", "province")
        .attr("d", path);

    d3.json("../Data/places.json", function(error, places) {
        //插入分组元素
        var location = svg.selectAll(".location")
            .data(places.location)
            .enter()
            .append("g")
            .attr("class", "location")
            .attr("transform", function(d) {
                //计算标注点的位置
                var coor = projection([d.log, d.lat, d.value]);
                console.log(coor);
                return "translate(" + coor[0] + "," + coor[1] + ")";
            })

        .append("circle")
            .attr("r", function(d) {
                return d.value;
            })
            .style("fill", function(d) {
                return "rgb(" + (d.value * 100) + ", " + (d.value * 50) + ", " + (d.value * 20) + ")";
            })
            .style("opacity", 0.75);



        //插入一个圆
        // location.append("circle")
        //         .attr("r", 7);
        // //插入一张图片
        // location.append("image")
        //     .attr("x",20)
        //     .attr("y",-40)
        //     .attr("width",90)
        //     .attr("height",90)
        //     .attr("xlink:href",function(d){
        //         return d.img;
        //     });

    });
});


d3.xml("../Data/southchinasea.svg", function(error, xmlDocument) {
    svg.html(function(d) {
        return d3.select(this).html() + xmlDocument.getElementsByTagName("g")[0].outerHTML;
    });

    var gSouthSea = d3.select("#southsea");

    gSouthSea.attr("transform", "translate(540,410)scale(0.5)")
        .attr("class", "southsea");

});