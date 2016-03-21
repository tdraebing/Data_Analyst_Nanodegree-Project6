//Execute in strict mode
"use strict";

//
// Global Objects and Methods
//

//define date format
var format = d3.time.format("%m/%d/%Y %I:%M:%S %p");

//define date range for scatterplot
var mindate = format.parse("1/1/1944 0:00:00 AM"),
    maxdate = format.parse("1/1/2000 0:00:00 AM");

//dimensions
var dimensions = {'map' : {'margin' : 20,
                            'width' : 1200,
                            'height' : 700},
                'scatter' : {'margin' : 60,
                            'width' : 1200,
                            'height' : 500},
                'bar_exp' : {'margin' : {'left' : 100, 'right' : 20, 'bottom' : 60, 'top' : 10},
                            'width' : 600,
                            'height' : 500}};

//define map projection
var projection = d3.geo.mercator()
    .scale(185)
    .translate([(dimensions.map.width - dimensions.map.margin) / 2.05,
        (dimensions.map.height - dimensions.map.margin) / 1.6]);


var scales = {'scatter' : {'x' : d3.time.scale.utc()
                              .domain([mindate, maxdate])
                              .range([0, dimensions.scatter.width - 2 * dimensions.scatter.margin]),
                            'y' : d3.scale.log()
                              .domain([Math.pow(10, -5), Math.pow(10, 6)])
                              .range([dimensions.scatter.height - 2 * dimensions.scatter.margin, 0])},
            'bar_exp' : {'y' : d3.scale.ordinal()
                                    .domain(["Russia", "China", "USA", "England", "France", "India", "Pakistan", "Unknown"])
                                    .rangeRoundBands([0, dimensions.bar_exp.height - dimensions.bar_exp.margin.bottom - dimensions.bar_exp.margin.top], .01),
                        'x' : d3.scale.log()
                                .domain([Math.pow(10, 0), Math.pow(10, 3.5)])
                                .range([1, dimensions.bar_exp.width - dimensions.bar_exp.margin.left - dimensions.bar_exp.margin.right])},
            'bar_yield' : {'y' : d3.scale.ordinal()
                                    .domain(["Russia", "China", "USA", "England", "France", "India", "Pakistan", "Unknown"])
                                    .rangeRoundBands([0, dimensions.bar_exp.height - dimensions.bar_exp.margin.bottom - dimensions.bar_exp.margin.top], .01),
                'x' : d3.scale.log()
                                    .domain([Math.pow(10, -5), Math.pow(10, 7)])
                                    .range([1, dimensions.bar_exp.width - dimensions.bar_exp.margin.left - dimensions.bar_exp.margin.right])}};

//define colors for each country
var cc = {'Russia' : 'DarkRed',
          'China' : 'OrangeRed',
          'USA' : 'MidnightBlue',
          'England' : 'Teal',
          'France' : 'Cyan',
          'India' : 'Green',
          'Pakistan' : 'Lime',
          'Unknown' : 'Black'};

var circle_range = [5, 20];

//extract radius
function get_radius(d, data){
    var extent = d3.extent(data, function(d){return d['max_yield'];});
    //radius for circles on map
    var radius = d3.scale.linear()
        .domain(extent)
        .range(circle_range);
    return radius(d);
}


// Define the brush for selection
var brush = d3.svg.brush();

// Clear the previously-active brush, if any.
function brushstart() {
    d3.select('brush').call(brush.clear());
}

// If the brush is empty, select all circles.
function brushend() {
    var selectedCountries = get_selected_countries();

    if (brush.empty()) {
        d3.select("#timescatter")
            .select("svg")
            .select('g.scatter')
            .selectAll(".greyed")
            .classed("greyed", function(d) {
                return selectedCountries.indexOf(d.Country) == -1;
            });
    }
}

//TOOLTIP

// Define the div for the tooltip
var div = d3.select("#timescatter")
            .append("div")
            .attr("class", "tooltip");

// Create text for tooltip
var tip_text = function(d){
    //check whether string formating prototype exists
    if (!String.prototype.format) {
        String.prototype.format = function() {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function(match, number) {
                return typeof args[number] != 'undefined'
                    ? args[number]
                    : match
                    ;
            });
        };
    }

    //add zero for dates
    function addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }

    //reverse NA substitution
    function showNA(d){
        if (d == 0.0001){
            return 'NA';
        } else{
            return d;
        }
    }


    return "Name: {0} <br/>".format(d.name)
            + "Date: {0}.{1}.{2} {3}:{4} <br/>".format(addZero(d.datetime.getUTCDate()),
                                                    addZero(d.datetime.getUTCMonth() + 1),
                                                    d.datetime.getUTCFullYear(),
                                                    addZero(d.datetime.getUTCHours()),
                                                    addZero(d.datetime.getUTCMinutes()))
            + "Longitude: {0}<br/>".format(d.longitude)
            + "Latitude: {0}<br/>".format(d.latitude)
            + "Testing Country: {0}<br/>".format(d.Country)
            + "Maximum Yield: {0}<br/>".format(showNA(d.max_yield))
            + "Explosion Medium: {0}<br/>".format(d.medium)
            + "Confirmation: {0}<br/>".format(d.confirmation)
            + "Data Source: {0}<br/>".format(d.source);
};

//DATA TRANSFORMATION
function loadData(d)  {
    var new_d = {};
    new_d['index'] = +d[''];
    if (+d['max_yield'] == 0){
        new_d['max_yield'] = 0.0001;
    } else {
        new_d['max_yield'] = +d['max_yield'];
    }
    new_d['mb'] = +d['mb'];
    new_d['latitude'] = parseFloat(d['latitude']);
    new_d['longitude'] = parseFloat(d['longitude']);
    new_d['depth'] = parseFloat(d['depth']);
    new_d['datetime'] = format.parse(d['datetime']);
    new_d['coords'] = projection([d['longitude'], d['latitude']]);
    new_d['Country'] = d.Country;
    new_d['name'] = d.name;
    new_d['medium'] = d.medium;
    new_d['confirmation'] = d.confirmation;
    new_d['source'] = d.source;
    return new_d;
}

//DATA POINT SELECTION AND FILTERING

var selectPoints = function(points) {
    d3.selectAll(points)
        .attr("r", function(){
            return circle_range[1];
        })
        .attr("opacity", 0.7);

    };

var deselectPoints = function(points, data) {
    d3.selectAll(points)
        .attr("r", function(d){return get_radius(d['max_yield'], data);})
        .attr("opacity", 0.3)
        .attr("stroke", "none");
};

var selectCoord = function(coord) {
    d3.select(coord)
        .attr("r", function(){
            return circle_range[1];
        })
        .attr('fill', function(d) {
            return cc[d.Country];
        })
        .attr("opacity", 0.7);
};

var deselectCoord = function(coord, data) {
    d3.select(coord)
        .attr('r', function(d) {
            return get_radius(d['max_yield'],data);
        })
        .attr('fill', 'rgba(0, 0, 0, 0)')
        .attr('stroke', function(d) {
            return cc[d.Country];
        })
        .attr('stroke-width', 1.5)
        .attr('opacity', 0.7)
};

var onPointOver = function(point) {
    selectPoints([point]);
    var coord = d3.select("div#map").select('[index="' + point.__data__.index + '"]');
    selectCoord(coord.node());
};

var onPointOut = function(point, data) {
    deselectPoints([point], data);
    var coord = d3.select("div#map").select('[index="' + point.__data__.index + '"]');
    deselectCoord(coord.node(), data);
};

var onCoordOver = function(point) {
    var coord = d3.select("div#map").select('[index="' + point.__data__.index + '"]');
    selectCoord(coord.node());
    var pointScat = d3.select("div#timescatter").select('[index="' + point.__data__.index + '"]');
    selectPoints([pointScat.node()]);

};

var onCoordOut = function(point, data) {
    var coord = d3.select("div#map").select('[index="' + point.__data__.index + '"]');
    deselectCoord(coord.node(), data);
    var pointScat = d3.select("div#timescatter").select('[index="' + point.__data__.index + '"]');
    deselectPoints([pointScat.node()], data);
};

function get_selected_countries(){
    var selectedCountries = [];

    d3.select('div#country_legend')
        .selectAll('circle.active')
        .each( function(){
            selectedCountries.push( d3.select(this).attr("id") );
        });

    return selectedCountries;
}

// Update plots for filtering purposes
function update(data){
    //for IE users...I know...WHY?
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(item) {
            var i = this.length;
            while (i--) {
                if (this[i] === item) return i;
            }
            return -1;
        };
    }

    var brush_ext = brush.extent();

    //set form values
    //dates
    $( "#min_datepicker" ).datepicker( "setDate", brush_ext[0][0]);
    $( "#max_datepicker" ).datepicker( "setDate", brush_ext[1][0] );

    //yield
    d3.select('input#miny')
        .attr('value', brush_ext[0][1]);
    d3.select('input#maxy')
        .attr('value', brush_ext[1][1]);

    var selectedCountries = get_selected_countries();

    var filtered_country = data.filter(function(d){
        if (selectedCountries.indexOf(d.Country) !== -1){
            return d;
        }
    });

    fill_timeline(filtered_country);

    if (brush_ext[0][1] <= 90000){
        d3.select("#timescatter")
            .select("svg")
            .select('g.scatter')
            .selectAll("circle")
            .classed("greyed", function(d) {
                return d.datetime <= brush_ext[0][0] || d.datetime >= brush_ext[1][0]
                    ||  d.max_yield <= brush_ext[0][1] || d.max_yield >= brush_ext[1][1];
            });
    } else{
        d3.select("#timescatter")
            .select("svg")
            .select('g.scatter')
            .selectAll(".greyed")
            .classed("greyed", function(d) {
                return selectedCountries.indexOf(d.Country) == -1;
            });
    }



    var filtered;

    if (brush_ext[0][1] > 55000){
        filtered = filtered_country;
    }else {
        filtered = filtered_country.filter(function(d) {
        return d.datetime >= brush_ext[0][0]
            && d.datetime <= brush_ext[1][0]
            && d.max_yield >= brush_ext[0][1]
            && d.max_yield <= brush_ext[1][1];
        });
    }

    plot_points(filtered);
}

//MAP

//create map
function map_draw(geo_data) {

    //translate to screen coordinates
    var path = d3.geo.path()
        .projection(projection);

    //create svg
    var svg_map = d3.select("#map")
        .append("svg")
        .attr("width", dimensions.map.width)
        .attr("height", dimensions.map.height)
        .append('g')
        .attr('class', 'map');

    //create map object
    var map = svg_map.selectAll('path')
        .data(geo_data.features)
        .enter()
        .append('path')
        .attr('class', 'map_path')
        .attr('d', path)
        .style('fill', update_countries);

    //set colors of countries on map
    function update_countries(d) {
        if(cc.hasOwnProperty(d.properties.name)) {
            return cc[d.properties.name];
        } else {
            return "lightGrey";
        }
    }
}

// Adding data points
function plot_points(data) {
    // Define the div for the tooltip
    var div = d3.select("#map").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    //creating circle elements
    var circles = d3.select("#map")
                    .select("svg")
                    .selectAll("circle")
                    .data(data, function(d){
                        return d.index;
                    })
                    .attr('r', function(d) {
                        return get_radius(d['max_yield'], data);
                    });

    //entering new circles
    circles.enter()
            .append("circle")
            .attr('cx', function(d) {
                return d.coords[0]; })
            .attr('cy', function(d) {
                return d.coords[1]; })
            .attr('r', function(d) {
                return get_radius(d['max_yield'], data);
            })
            .attr('fill', 'rgba(0, 0, 0, 0)')
            .attr('stroke', function(d) {
                return cc[d.Country];
            })
            .attr('stroke-width', 1.5)
            .attr('opacity', 0.7)
            .attr('index', function(d){return d.index;})
            .on("mouseover", function(d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(tip_text(d))
                    .style("left", (d3.event.pageX + 20) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
                onCoordOver(this);
            })
            .on("mouseout", function() {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
                onCoordOut(this, data);
            });

    // removing filtered out data points
    circles.exit().remove();
}

//SCATTER PLOT

//creating plot
function timeline(data){

    //Adding svg + plot
    var tl_svg = d3.select("#timescatter")
        .append("svg")
        .attr("width", dimensions.scatter.width)
        .attr("height", dimensions.scatter.height)
        .append("g")
        .attr("class", "scatter")
        .attr("transform", "translate(" + dimensions.scatter.margin + "," + dimensions.scatter.margin + ")");

    //defining and adding axes
    var xAxis = d3.svg.axis()
        .scale(scales.scatter.x)
        .orient("bottom");

    tl_svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (dimensions.scatter.height - 2 * dimensions.scatter.margin) + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", dimensions.scatter.width - 2 * dimensions.scatter.margin)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Time");

    var yAxis = d3.svg.axis()
        .scale(scales.scatter.y)
        .orient("left");

    tl_svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("dy", ".71em")
        .attr("y", 6)
        .style("text-anchor", "end")
        .text("Maximum Reported Yield [kt]");


    //creating and adding brush for filtering

    brush.x(scales.scatter.x)
        .y(scales.scatter.y)
        .on("brushstart", brushstart)
        .on("brush", function(){update(data);})
        .on("brushend", brushend);

    tl_svg.append("g")
        .attr("class", "brush")
        .call(brush)
        .selectAll("rect")

}



//filling scatter plot
function fill_timeline(data) {
    // Define the div for the tooltip
    var div = d3.select("#timescatter").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Create circles
    var circles = d3.select("#timescatter")
        .select("svg")
        .select('g.scatter')
        .selectAll("circle")
        .data(data, function (d) {
            return d.index;
        })
        .attr('r', function (d) {
            return get_radius(d['max_yield'], data);
        });

    // Enter new data
    circles.enter().append("circle")
        .classed('greyed', false)
        .attr('r', function (d) {
            return get_radius(d['max_yield'], data);
        })
        .attr("cx", function (d) {
            return scales.scatter.x(d.datetime);
        })
        .attr("cy", function (d) {
            return scales.scatter.y(d.max_yield);
        })
        .attr("fill", function (d) {
            return cc[d.Country];
        })
        .attr("opacity", 0.3)
        .attr('stroke', function (d) {
            return cc[d.Country];
        })
        .attr('stroke-width', 1.5)
        .attr('stroke-opacity', 0.7)
        .attr('index', function (d) {
            return d.index;
        })
        .on("mouseover", function (d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html(tip_text(d))
                .style("left", (d3.event.pageX + 20) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            onPointOver(this);
        })
        .on("mouseout", function () {
            div.transition()
                .duration(500)
                .style("opacity", 0);
            onPointOut(this, data);
        });



    circles.exit().remove();
}

// BAR PLOTS

// total explosions
function build_bar_te(data){
    var chart = d3.select('div#test_count')
        .append('svg')
        .attr('class', 'bar_exp_svg')
        .attr("width", dimensions.bar_exp.width)
        .attr("height", dimensions.bar_exp.height)
        .append("g")
        .attr("class", "bar_exp")
        .attr("transform", "translate(" + dimensions.bar_exp.margin.left + "," + dimensions.bar_exp.margin.top + ")");

    //defining and adding axes
    var xAxis = d3.svg.axis()
        .scale(scales.bar_exp.x)
        .orient("bottom")
        .ticks(3);

    chart.append("g")
        .attr("class", "x axis")
        .attr("transform",
            "translate(0," + (dimensions.bar_exp.height - dimensions.bar_exp.margin.bottom - dimensions.bar_exp.margin.top) + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", (dimensions.bar_exp.width - dimensions.bar_exp.margin.right - dimensions.bar_exp.margin.left))
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Test Count");

    var yAxis = d3.svg.axis()
        .scale(scales.bar_exp.y)
        .orient("left");

    chart.append("g")
        .attr("class", "y axis")
        .call(yAxis);
}

function total_exp(data){
    var agg_exp = function(leaves){
                    return d3.sum(leaves, function() {
                                            return 1;
                                        });

                    };

    var te_nested = d3.nest()
                        .key(function(d) {return d.Country;})
                        .rollup(agg_exp)
                        .entries(data);


    var bar = d3.select('#test_count')
        .select("svg")
        .select('g.bar_exp')
        .selectAll(".bar")
        .data(te_nested)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", function(d) {
            return scales.bar_exp.y(d.key);
        })
        .attr("width", function(d) {
            return scales.bar_exp.x(d.values);
        })
        .attr("height", scales.bar_exp.y.rangeBand())
        .attr("x", 1)
        .attr("fill", function (d) {
            return cc[d.key];
        })
        .attr('opacity', 0.7)
        .append("text")
        .attr("x", function(d) { return 20; })
        .attr("y", scales.bar_exp.y.rangeBand() / 2)
        .attr("dy", ".35em")
        .text(function(d) { return d.values; });
}

// total yield
function build_bar_yield(data){
    var chart = d3.select('div#acc_yield')
        .append('svg')
        .attr('class', 'bar_yield_svg')
        .attr("width", dimensions.bar_exp.width)
        .attr("height", dimensions.bar_exp.height)
        .append("g")
        .attr("class", "bar_yield")
        .attr("transform", "translate(" + dimensions.bar_exp.margin.left + "," + dimensions.bar_exp.margin.top + ")");

    //defining and adding axes
    var xAxis = d3.svg.axis()
        .scale(scales.bar_yield.x)
        .orient("bottom")
        .ticks(3);

    chart.append("g")
        .attr("class", "x axis")
        .attr("transform",
            "translate(0," + (dimensions.bar_exp.height - dimensions.bar_exp.margin.bottom - dimensions.bar_exp.margin.top) + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", (dimensions.bar_exp.width - dimensions.bar_exp.margin.right - dimensions.bar_exp.margin.left))
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Yield [kt]");

    var yAxis = d3.svg.axis()
        .scale(scales.bar_yield.y)
        .orient("left");

    chart.append("g")
        .attr("class", "y axis")
        .call(yAxis);
}

function total_yield(data){
    var agg_yield = function(leaves){
        return d3.sum(leaves, function(d) {
            return d['max_yield'];
        });

    };

    var te_nested = d3.nest()
        .key(function(d) {return d.Country;})
        .rollup(agg_yield)
        .entries(data);


    var bar = d3.select('#acc_yield')
        .select("svg")
        .select('g.bar_yield')
        .selectAll(".bar")
        .data(te_nested)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", function(d) {
            return scales.bar_yield.y(d.key);
        })
        .attr("width", function(d) {
            return scales.bar_yield.x(d.values);
        })
        .attr("height", scales.bar_yield.y.rangeBand())
        .attr("x", 1)
        .attr("fill", function (d) {
            return cc[d.key];
        })
        .attr('opacity', 0.7)
        .append("text")
        .attr("x", function(d) { return 20; })
        .attr("y", scales.bar_yield.y.rangeBand() / 2)
        .attr("dy", ".35em")
        .text(function(d) { return d.values; });
}

// FILTERING COUNTRIES

function country_filter(data){
    //create legend
    // Nest the entries by symbol
    var dataNest = d3.nest()
        .key(function(d) {return d.Country;})
        .entries(data);

    var margin = {top: 30, right: 20, bottom: 30, left: 50},
        width = 1200 - margin.left - margin.right,
        height = 140 - margin.top - margin.bottom;

    var legendSpace = width/dataNest.length;

    var legend_svg = d3.select('div#country_legend')
                        .append('svg')
                        .attr('width', width)
                        .attr('height', height);

    // Loop through each symbol / key
    dataNest.forEach(function(d, i) {
        legend_svg.append("circle")
            .attr("cx", (legendSpace/2)+i*legendSpace)
            .attr("cy", 30)
            .attr('r', 20)
            .attr('opacity', 0.9)
            .attr('id', function(){return d.key;})
            .classed('active', true)
            .style("fill", function() {
                return cc[d.key]; })
            .on('click', function(){
                var active   = d3.select(this).classed('active') ? false : true,
                    newOpacity = active ? 0.9 : 0.5;
                d3.select(this)
                    .classed('active', function(){
                        return active;})
                    .transition()
                    .duration(200)
                    .style("opacity", newOpacity);
                update(data);
                });

        legend_svg.append("text")
            .attr("x", (legendSpace/2)+i*legendSpace)
            .attr("y", 75)
            .attr("class", "legend")
            .text(d.key);

    });

}

// COUNTRY SELECTION BUTTONS

function deselect_Countries(data){
    d3.select('#country_legend')
        .selectAll('circle')
        .classed('active', false)
        .transition()
        .duration(200)
        .style("opacity", 0.5);
    update(data);
}

function select_Countries(data){
    d3.select('#country_legend')
        .selectAll('circle')
        .classed('active', true)
        .transition()
        .duration(200)
        .style("opacity", 0.9);
    update(data);
}

function country_buttons(data){

    //create button for deselecting all
    d3.select('div#b_deselect')
        .append('input')
        .attr('type', 'button')
        .attr("name", "deselectAll")
        .attr("value", "Deselect all Countries")
        .attr("class", "block")
        .on("click", function(){deselect_Countries(data);});

    //create button for selecting all
    d3.select('div#b_select')
        .append('input')
        .attr('type', 'button')
        .attr("name", "selectAll")
        .attr("value", "Select all Countries")
        .attr("class", "block")
        .on("click", function(){select_Countries(data);});
}

// REMOVE SELECTION

function selection_removal(data) {
    d3.select('div#bc_selection')
        .append('input')
        .attr('type', 'button')
        .attr("name", "rmFilter")
        .attr("value", "Remove Selection")
        .attr("class", "block")
        .on("click", function(){
            d3.selectAll(".brush").call(brush.clear());
            update(data);
        });

}

// FILTER REMOVAL

function filter_removal(data) {
    //reverse filters
    function remove_filters() {
        d3.select("#timescatter")
            .select("svg")
            .select('g.scatter')
            .selectAll(".greyed")
            .classed("greyed", false);
        d3.selectAll(".brush").call(brush.clear());
        select_Countries(data);
    }

    //create button for removing filters
    d3.select('div#bc_all')
        .append('input')
        .attr('type', 'button')
        .attr("name", "rmFilter")
        .attr("value", "Remove all Filters")
        .attr("class", "block")
        .on("click", remove_filters);
}

function control_brush(){
    //dates
    var min_date = d3.select('input#min_datepicker').node().value;
    var max_date = d3.select('input#max_datepicker').node().value;
    var pickerformat = d3.time.format("%m/%d/%Y");
    var min_date_formatted = pickerformat.parse(min_date),
        max_date_formatted = pickerformat.parse(max_date);


    //yield
    var min_yield = d3.select('input#miny').node().value;
    var max_yield = d3.select('input#maxy').node().value;

    //draw brush
    brush.extent([[min_date_formatted, min_yield],[max_date_formatted, max_yield]]);
    brush(d3.select(".brush").transition());
    brush.event(d3.select(".brush").transition().delay(1000));
}

function update_filters(data){
    function apply_filters(){
        //circle size
        var min_cs = d3.select('input#min').node().value;
        var max_cs = d3.select('input#max').node().value;
        circle_range = [min_cs, max_cs];
        d3.select("#map")
            .select("svg")
            .selectAll("circle")
            .attr('r', function(d) {
                return get_radius(d['max_yield'], data);
            });
        d3.select("#timescatter")
            .select("svg")
            .select('g.scatter')
            .selectAll("circle")
            .attr('r', function(d) {
                return get_radius(d['max_yield'], data);
            });

        control_brush();

    }

    d3.select('div#update_filter_button')
        .append('input')
        .attr('type', 'button')
        .attr("name", "update_filters")
        .attr("value", "Update")
        .attr("class", "block")
        .on("click", apply_filters);
}

// DRAW VISUALIZATION

function draw(){
    //draw map
    d3.json("./data/map/world_countries.json",
        function (d){
            map_draw(d)
        });

    //create data dependent objects
    d3.csv("./data/preproc_nuclear_weapon_tests.csv",
        function (d) {
            return loadData(d);
        },
        function (d) {
            country_filter(d);
            update_filters(d);
            country_buttons(d);
            selection_removal(d);
            filter_removal(d);
            plot_points(d);
            timeline(d);
            fill_timeline(d);
            build_bar_te(d);
            build_bar_yield(d);
            total_exp(d);
            total_yield(d);
        });

}

