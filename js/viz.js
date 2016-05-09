//Execute in strict mode
"use strict";

function draw(){

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // MISC (that has to be defined in the beginning)
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    /*
     Date formating
     */
    
    var fullDateFormat  = d3.time.format("%m/%d/%Y %I:%M:%S %p");


    var months = [  'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December'];
    
    /*
    slider selector
     */

    var slider = $("#sliderAnimation");

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // OPTIONS
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    /*
     Date range for scatter plot
     */
    
    var minDate = fullDateFormat.parse("1/1/1944 0:00:00 AM"),
        maxDate = fullDateFormat.parse("1/1/2000 0:00:00 AM");
    
    /*
    Color mapping for countries
     */
    
    var countryColors = [{'country' : 'Russia',     'color' : 'DarkRed',        'id' : 0},
                         {'country' : 'China',      'color' :  'OrangeRed',     'id' : 1},
                         {'country' : 'USA',        'color' :  'MidnightBlue',  'id' : 2},
                         {'country' : 'England',    'color' :  'Teal',          'id' : 3},
                         {'country' : 'France',     'color' :  'Cyan',          'id' : 4},
                         {'country' : 'India',      'color' :  'Green',         'id' : 5},
                         {'country' : 'Pakistan',   'color' : 'Lime',           'id' : 6},
                         {'country' : 'Unknown',    'color' :  'Black',         'id' : 7}];
    
    /*
    plot dimensions
     */

    var divWidth = $( '#visualizationLegend' ).width();
    
    var dimensions = {'map'     :   {'margin' : {'left' : 20,
                                                 'right' : 20,
                                                 'top' : 20,
                                                 'bottom' : 20},
                                     'width'  : divWidth,
                                     'height' : (5/9) * (divWidth >= 800 ? divWidth : 800)},
                      'scatter' :   {'margin' : {'left' : 50,
                                                 'right' : 20,
                                                 'top' : 20,
                                                 'bottom' : 20},
                                     'width'  : divWidth,
                                     'height' : (5/9) * (divWidth >= 800 ? divWidth : 800)},
                      'timeBar' :   {'margin' : {'left' : 70,
                                                 'right' : 20,
                                                 'top' : 20,
                                                 'bottom' : 20},
                                     'width'  : divWidth,
                                     'height' : (5/9) * (divWidth >= 800 ? divWidth : 800)},
                      'bars'    :   {'margin' : {'left' : 20,
                                                 'right' : 20,
                                                 'top' : 20,
                                                 'bottom' : 20},
                                     'width'  : divWidth,
                                     'height' : (1/9) * (divWidth >= 800 ? divWidth : 800)},
                      'legend'  :   {'margin' : {'left' : 20,
                                                 'right' : 20,
                                                 'top' : 20,
                                                 'bottom' : 20},
                                     'width'  : divWidth,
                                     'height' : (1.4/9) * (divWidth >= 800 ? divWidth : 800)}};

    /*
    map projection
     */
    
    var mapScale = {'scale'           : divWidth / 7,
                    'translateWidth'  : 2,
                    'translateHeight' : 1.4};
    
    /*
     Circle size
     */
    
    var circleRange = [5, 20];
    
    /*
    Default values for aggregated timeline
     */

    var AccumulatedTimelineAggregation = 'Count',
        AccumulatedTimelineScale = 'Relative';
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // CALCULATED VIZ OPTIONS
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    /*
     map projection
     */
    
    var projection = d3.geo.mercator()
                           .scale(mapScale.scale)
                           .translate([(dimensions.map.width - dimensions.map.margin.left) / mapScale.translateWidth,
                                       (dimensions.map.height - dimensions.map.margin.top) / mapScale.translateHeight]);
    
    /*
     Scales for all plots
     */

    var yearSeries = [];
    for (var i = 1944; i != 1999; ++i) yearSeries.push(i);
    
    var scales = {'scatter' :   {'x' : d3.time.scale.utc()
                                         .domain([minDate, maxDate])
                                         .range([0, dimensions.scatter.width - dimensions.scatter.margin.right - dimensions.scatter.margin.left]),
                                 'y' : d3.scale.log()
                                         .domain([Math.pow(10, -5), Math.pow(10, 6)])
                                         .range([dimensions.scatter.height - dimensions.scatter.margin.top - dimensions.scatter.margin.bottom, 0])},
                  'timeBar' :   {'x' : d3.scale.ordinal()
                                               .domain(yearSeries)
                                               .rangeRoundBands([0, dimensions.timeBar.width - dimensions.timeBar.margin.left - dimensions.timeBar.margin.right], .1),
                                 'y' : d3.scale.linear()
                                          .range([dimensions.timeBar.height - dimensions.timeBar.margin.top - dimensions.timeBar.margin.bottom, 0])},
                  'barCount' :  {'x' : d3.scale.linear()
                                         .range([0, dimensions.bars.width - dimensions.bars.margin.left - dimensions.bars.margin.right])},
                  'barYield' :  {'x' : d3.scale.linear()
                                         .range([0, dimensions.bars.width - dimensions.bars.margin.left - dimensions.bars.margin.right])}};

    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // FUNCTIONS TO RETRIEVE OPTIONS
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    /*
    Circle size
     */
    
    var getRadius = function(d, data){
        var extent = d3.extent(data, function(d){return d['max_yield'];});
        var radius = d3.scale.linear()
                             .domain(extent)
                             .range(circleRange);
        return radius(d);
    };
    
    /*
     Color mapping for countries
     */
    
    var countryColorsMap = d3.map(countryColors, function(d){return d.country});
    
    var getColor = function(country){
            return countryColorsMap.get(country).color;
        };
    
    /*
    Country
     */
    
    var getSelectedCountries = function(){
            var selectedCountries = [];
    
            d3.select('div#legendCountries')
                .selectAll('circle.active')
                .each( function(){
                    selectedCountries.push( d3.select(this).attr("id") );
                });
    
            return selectedCountries;
        };
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //DATA LOADING AND TRANSFORMATION
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    var loadData = function(d)  {
            var new_d = {};
    
            if (+d['max_yield'] == 0){
                new_d['max_yield']  = 0.0001;
            } else {
                new_d['max_yield']  = +d['max_yield'];
            }
            new_d['index']          = +d[''];
            new_d['mb']             = +d['mb'];
            new_d['latitude']       = parseFloat(d['latitude']);
            new_d['longitude']      = parseFloat(d['longitude']);
            new_d['depth']          = parseFloat(d['depth']);
            new_d['datetime']       = fullDateFormat.parse(d['datetime']);
            new_d['coords']         = projection([d['longitude'], d['latitude']]);
            new_d['Country']        = d.Country;
            new_d['name']           = d.name;
            new_d['medium']         = d.medium;
            new_d['confirmation']   = d.confirmation;
            new_d['source']         = d.source;
    
            return new_d;
        };


    var aggregatedCount = function(leaves){
        return d3.sum(leaves, function() {
            return 1;
        });
    };

    var aggregatedYield = function(leaves){
        return d3.sum(leaves, function(d) {
            return d.max_yield;
        });
    };
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // PLOT OVERLAY ELEMENTS
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    /*
    Brush for filtering through scatter plot
     */

    var brushStart = function() {
            d3.select('brush').call(brush.clear());
        };
    
    var brushEnd = function() {
            var selectedCountries = getSelectedCountries();
    
            if (brush.empty()) {
                d3.select("#timescatter")
                  .select("svg")
                  .select('g.scatter')
                  .selectAll(".greyed")
                  .classed("greyed", function(d) {
                        return selectedCountries.indexOf(d.Country) == -1;
                  });
            }
        };

    var brush = d3.svg.brush();

    /*
    Tooltip and data point hovering
     */


    //check whether string formatting prototype exists
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
    
    var tooltipText = function(d){
            //add zero for dates
            var addZero = function(i) {
                    if (i < 10) {
                        i = "0" + i;
                    }
                    return i;
                };
    
            //reverse NA substitution to allow showing this data points in plots
            var showNA = function(d){
                    if (d == 0.0001){
                        return 'NA';
                    } else{
                        return d;
                    }
                };
    
    
            return    "Name: {0} <br/>".format(d.name)
                    + "Date: {0}.{1}.{2} {3}:{4} <br/>".format( addZero(d.datetime.getUTCDate()),
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
    
    /*
    Data point hovering
     */
    
    var selectPoints = function(points) {
            d3.selectAll(points)
                .attr("r", function(){
                    return circleRange[1];
                })
                .attr("opacity", 0.7);
    
        };
    
    var deselectPoints = function(points, data) {
            d3.selectAll(points)
                .attr("r", function(d){return getRadius(d['max_yield'], data);})
                .attr("opacity", 0.3)
                .attr("stroke", "none");
        };
    
    var selectCoord = function(coord) {
            d3.select(coord)
                .attr("r", function(){
                    return circleRange[1];
                })
                .attr('fill', function(d) {
                    return getColor(d.Country);
                })
                .attr("opacity", 0.7);
        };
    
    var deselectCoord = function(coord, data) {
            d3.select(coord)
                .attr('r', function(d) {
                    return getRadius(d['max_yield'],data);
                })
                .attr('fill', 'rgba(0, 0, 0, 0)')
                .attr('stroke', function(d) {
                    return getColor(d.Country);
                })
                .attr('stroke-width', 1.5)
                .attr('opacity', 0.7)
        };
    
    var onPointOver = function(point) {
            selectPoints([point]);
            var coord = d3.select("div#map")
                          .select('[index="' + point.__data__.index + '"]');
            selectCoord(coord.node());
        };
    
    var onPointOut = function(point, data) {
            deselectPoints([point], data);
            var coord = d3.select("div#map")
                          .select('[index="' + point.__data__.index + '"]');
            deselectCoord(coord.node(), data);
        };
    
    var onCoordOver = function(point) {
            var coord = d3.select("div#map")
                          .select('[index="' + point.__data__.index + '"]');
            selectCoord(coord.node());
            var circle = d3.select("div#timescatter")
                           .select('[index="' + point.__data__.index + '"]');
            selectPoints([circle.node()]);
        };
    
    var onCoordOut = function(point, data) {
            var coord = d3.select("div#map")
                          .select('[index="' + point.__data__.index + '"]');
            deselectCoord(coord.node(), data);
            var circle = d3.select("div#timescatter")
                           .select('[index="' + point.__data__.index + '"]');
            deselectPoints([circle.node()], data);
        };
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // PLOT FRAMEWORKS
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    /*
    Barstack of total explosions
     */
    
    var drawBarCount = function(){
            var barCount = d3.select('div#barCount')
                             .append('svg')
                             .attr('class', 'svgBarCount')
                             .attr("width", dimensions.bars.width)
                             .attr("height", dimensions.bars.height)
                             .append("g")
                             .attr("class", "barCount")
                             .attr("transform",
                                   "translate(" + dimensions.bars.margin.left + ","
                                                + dimensions.bars.margin.top + ")");
    
            var title = barCount.append("text")
                                .attr("class", "label")
                                .attr("x", (dimensions.bars.width/2))
                                .attr("y", -6)
                                .style("text-anchor", "middle")
                                .text("Total Explosions");
    
            var xAxis = d3.svg.axis()
                              .scale(scales.barCount.x)
                              .orient("bottom")
                              .ticks(10);
    
            var xAxisBar = barCount.append("g")
                                   .attr("class", "x axis")
                                   .attr("transform",
                                         "translate(0," + (dimensions.bars.height - dimensions.bars.margin.top - dimensions.bars.margin.bottom) + ")")
                                   .call(xAxis);
    
        };
    
    /*
     Barstack of total yield
     */
    
    var drawBarYield = function(){
            var barYield = d3.select('div#barYield')
                             .append('svg')
                             .attr('class', 'svgBarYield')
                             .attr("width", dimensions.bars.width)
                             .attr("height", dimensions.bars.height)
                             .append("g")
                             .attr("class", "barYield")
                             .attr("transform", "translate(" + dimensions.bars.margin.left + ","
                                                             + dimensions.bars.margin.top + ")");
    
            var title = barYield.append("text")
                                .attr("class", "label")
                                .attr("x", (dimensions.bars.width / 2))
                                .attr("y", -6)
                                .style("text-anchor", "middle")
                                .text("Total Yield");
    
            var xAxis = d3.svg.axis()
                              .scale(scales.barYield.x)
                              .orient("bottom")
                              .ticks(10, 's');
    
            var xAxisBar = barYield.append("g")
                                   .attr("class", "x axis")
                                   .call(xAxis)
                                   .attr("transform",
                                         "translate(0," + (dimensions.bars.height - dimensions.bars.margin.top - dimensions.bars.margin.bottom) + ")")
    
        };
    
    /*
     Line plot of accumulated data over time
     */
    
    var drawAccumulatedTimeline = function(){
            var svgAccumulatedTimeline = d3.select("#accumulatedTimeline")
                                           .append("svg")
                                           .attr('class', 'svgAccumulatedTimeline')
                                           .attr("width", dimensions.timeBar.width)
                                           .attr("height", dimensions.timeBar.height)
                                           .append("g")
                                           .attr("class", "accumulatedTimeline")
                                           .attr("transform", "translate(" + dimensions.timeBar.margin.left + ","
                                                                           + dimensions.timeBar.margin.top + ")");

        var yearSeries = [];
        for (var i = 1945; i <= 1998; i = i + 4) yearSeries.push(i);
            var xAxis = d3.svg.axis()
                              .scale(scales.timeBar.x)
                              .orient("bottom")
                              .tickValues(yearSeries);
    
            var xAxisLine = svgAccumulatedTimeline.append("g")
                                                  .attr("class", "x axis")
                                                  .attr("transform",
                                                        "translate(0," + (dimensions.timeBar.height - dimensions.timeBar.margin.top - dimensions.timeBar.margin.bottom) + ")")
                                                  .call(xAxis)
                                                  .append("text")
                                                  .attr("class", "label")
                                                  .attr("x", (dimensions.timeBar.width - dimensions.timeBar.margin.left - dimensions.timeBar.margin.right)/2)
                                                  .attr("y", 48)
                                                  .attr('fill', 'black')
                                                  .style("text-anchor", "middle")
                                                  .text("Time");
        
            var yAxis = d3.svg.axis()
                                   .scale(scales.timeBar.y)
                                   .orient("left");
    
            var yAxisLine =  svgAccumulatedTimeline.append("g")
                                                   .attr("class", "y axis")
                                                   .call(yAxis)
                                                   .append("text")
                                                   .attr("class", "label")
                                                   .attr("transform", "rotate(-90)")
                                                   .attr("dy", ".71em")
                                                   .attr("y", 6)
                                                   .attr('fill', 'black')
                                                   .style("text-anchor", "end");
        };
    
    /*
     create map
     */
    
    var drawMap = function(dataGeo) {
            //translate map paths to screen coordinates
            var pathMap = d3.geo.path()
                                .projection(projection);
    
            var svgMap = d3.select("#map")
                           .append("svg")
                           .attr('class', 'svgMap')
                           .attr("width", dimensions.map.width)
                           .attr("height", dimensions.map.height)
                           .append('g')
                           .attr('class', 'map');
    
            var map = svgMap.selectAll('path')
                            .data(dataGeo.features)
                            .enter()
                            .append('path')
                            .attr('class', 'pathMap')
                            .attr('d', pathMap)
                            .style('fill', function(d){
                                                    if(countryColorsMap.has(d.properties.name)) {
                                                        return getColor(d.properties.name);
                                                    } else {
                                                        return "lightGrey";
                                                    }
                                             });

            // Define the div for the tooltip
            var divTooltip = d3.select("#map")
                               .append("div")
                               .attr("class", "tooltip")
                               .style("opacity", 0);
        };
    
    /*
     creating timeline scatter plot
     */
    
    var drawTimeline = function(data){
            var svgTimeline = d3.select("#timeline")
                                .append("svg")
                                .attr("class", "svgTimeline")
                                .attr("width", dimensions.scatter.width)
                                .attr("height", dimensions.scatter.height)
                                .append("g")
                                .attr("class", "scatter")
                                .attr("transform", "translate(" + dimensions.scatter.margin.left + ","
                                                                + dimensions.scatter.margin.top + ")");
    
            var xAxis = d3.svg.axis()
                              .scale(scales.scatter.x)
                              .orient("bottom");
    
            var xAxisTimeline = svgTimeline.append("g")
                                           .attr("class", "x axis")
                                           .attr("transform",
                                                 "translate(0," + (dimensions.scatter.height - dimensions.scatter.margin.top - dimensions.scatter.margin.bottom) + ")")
                                           .call(xAxis)
                                           .append("text")
                                           .attr("class", "label")
                                           .attr("x", dimensions.scatter.width - dimensions.scatter.margin.left - dimensions.scatter.margin.right)
                                           .attr("y", -6)
                                           .attr('fill', 'black')
                                           .style("text-anchor", "end")
                                           .text("Time");
    
            var yAxis = d3.svg.axis()
                              .scale(scales.scatter.y)
                              .orient("left");
    
            var yAxisTimeline = svgTimeline.append("g")
                                           .attr("class", "y axis")
                                           .call(yAxis)
                                           .append("text")
                                           .attr("class", "label")
                                           .attr("transform", "rotate(-90)")
                                           .attr("dy", ".71em")
                                           .attr("y", 6)
                                           .attr('fill', 'black')
                                           .style("text-anchor", "end")
                                           .text("Maximum Reported Yield [kt]");

            brush.x(scales.scatter.x)
                 .y(scales.scatter.y)
                 .on("brushstart", brushStart)
                 .on("brush", function(){updatePlots(data);})
                 .on("brushend", brushEnd);

            var brushTimeline = svgTimeline.append("g")
                                           .attr("class", "brush")
                                           .call(brush)
                                           .selectAll("rect");

            // Define the div for the tooltip
            var divTooltip = d3.select("#timeline")
                               .append("div")
                               .attr("class", "tooltip")
                               .style("opacity", 0);
        };
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // CONTROL ELEMENTS
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /*
    Initiate Accumulated Timeline buttons
     */

    var buildAccumulatedTimeline = function(data){
        var buttonAggregation = d3.select('#accumulatedTimelineButtons')
                                  .select('.buttonAggregation');

        buttonAggregation.classed(AccumulatedTimelineAggregation, true)
                         .attr('value', AccumulatedTimelineAggregation);

        buttonAggregation.on('click', function(){
                                 buttonAggregation.classed(AccumulatedTimelineAggregation, false)
                                 AccumulatedTimelineAggregation = AccumulatedTimelineAggregation === 'Count' ? 'Yield' : 'Count';
                                 buttonAggregation.classed(AccumulatedTimelineAggregation, true)
                                                  .attr('value', AccumulatedTimelineAggregation);
                                 updatePlots(data);
                         });

        var buttonScale = d3.select('#accumulatedTimelineButtons')
                            .select('.buttonScale');

        buttonScale.classed(AccumulatedTimelineScale, true)
                   .attr('value', AccumulatedTimelineScale);

        buttonScale.on('click', function(){
                                buttonScale.classed(AccumulatedTimelineScale, false)
                                AccumulatedTimelineScale = AccumulatedTimelineScale === 'Relative' ? 'Absolute' : 'Relative';
                                buttonScale.classed(AccumulatedTimelineScale, true)
                                    .attr('value', AccumulatedTimelineScale);
                                updatePlots(data);
                        });
    };


    /*
    Draw country legend and filter interface
     */
    
    var drawCountryLegend = function(){
            var svgLegend = d3.select('div#legendCountries')
                              .append('svg')
                              .attr('class', 'svgLegendCountries')
                              .attr('width', dimensions.legend.width - dimensions.legend.margin.left - dimensions.legend.margin.right)
                              .attr('height', dimensions.legend.height - dimensions.legend.margin.top - dimensions.legend.margin.bottom)
                              .append('g')
                              .attr('class', 'legend');
        };
    
    /*
    Filter form
     */

    var buildFilterForm = function(data){
        //create button for selecting all
        d3.select('div#buttonSelectAll')
          .append('input')
          .attr('type', 'button')
          .attr("name", "selectAll")
          .attr("value", "Select all Countries")
          .attr("class", "block")
          .on("click", function(){selectAllCountries(data);});
        
        //create button for deselecting all
        d3.select('div#buttonDeselectAll')
          .append('input')
          .attr('type', 'button')
          .attr("name", "deselectAll")
          .attr("value", "Deselect all Countries")
          .attr("class", "block")
          .on("click", function(){deselectAllCountries(data);});

        //create button to remove selection
        d3.select('div#buttonRemoveSelection')
          .append('input')
          .attr('type', 'button')
          .attr("name", "removeSelection")
          .attr("value", "Remove Selection")
          .attr("class", "block")
          .on("click", function(){
                d3.selectAll(".brush")
                  .call(brush.clear());
                updatePlots(data);
          });

        //create button for removing all filters
        d3.select('div#buttonRemoveFilters')
          .append('input')
          .attr('type', 'button')
          .attr("name", "removeFilters")
          .attr("value", "Remove all Filters")
          .attr("class", "block")
          .on("click", function(){removeAllFilters(data);});
        
        //create button to apply form
        d3.select('div#buttonUpdateFilter')
          .append('input')
          .attr('type', 'button')
          .attr("name", "updateFilters")
          .attr("value", "Update")
          .attr("class", "block")
          .on("click", function(){
              brushControl();
          });
    };


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // FILL PLOTS
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    /*
    Fill count bar
     */

    var fillBarCount = function(data){
            var nestedCount = d3.nest()
                                .key(function(d) {return d.Country;})
                                .rollup(aggregatedCount)
                                .sortKeys(function(a, b) {return countryColorsMap.get(a).id - countryColorsMap.get(b).id;})
                                .entries(data);
    
            var dataBarCount = function(data){
                    var ar = [];
                    var y0 = 0;
                    for (var d in data){
                        if (data.hasOwnProperty(d)){
                            ar[d] = {'key' : data[d].key,
                                'y0' : y0,
                                'y1' : y0 + data[d].values,
                                'value' : data[d].values};
                            y0 = y0 + data[d].values;
                        }
                    }
                    return ar;
                };
    
            var totalCount = d3.sum(nestedCount, function(d){return d.values;});

            var svgBarCount = d3.select('#barCount')
                                .select(".svgBarCount");
            
            //update axis to new data
            scales.barCount.x.domain([0, totalCount]);
    
            var xAxis = d3.svg.axis()
                              .scale(scales.barCount.x)
                              .orient("bottom")
                              .ticks(10);
                    
            var xAxisBarCount = svgBarCount.selectAll(".axis")
                                           .call(xAxis);
            
            //clear elements before update
            svgBarCount.select('g.barCount')
                       .selectAll(".bar")
                       .remove();
            
            //add new data
            var bars = svgBarCount.select('g.barCount')
                                  .selectAll(".bar")
                                  .data(dataBarCount(nestedCount))
                                  .enter()
                                  .append("rect")
                                  .attr("class", "bar")
                                  .attr("y", 0)
                                  .attr('x', function(d) {
                                        return scales.barCount.x(d.y0);
                                  })
                                  .attr("width", function(d) {
                                        return scales.barCount.x(d.value);
                                  })
                                  .attr("height", dimensions.bars.height - dimensions.bars.margin.top - dimensions.bars.margin.bottom)
                                  .attr("fill", function (d) {
                                        return getColor(d.key);
                                  })
                                  .attr('opacity', 0.7);
        };
    
    /*
    Fill yield bar
     */

    var fillBarYield = function(data){
            var nestedYield = d3.nest()
                                .key(function(d) {return d.Country;})
                                .rollup(aggregatedYield)
                                .sortKeys(function(a, b) {return countryColorsMap.get(a).id - countryColorsMap.get(b).id;})
                                .entries(data);
    
            var dataBarYield = function(data){
                    var ar = [];
                    var y0 = 0;
                    for (var d in data){
                        if (data.hasOwnProperty(d)){
                            ar[d] = {'key' : data[d].key,
                                'y0' : y0,
                                'y1' : y0 + data[d].values,
                                'value' : data[d].values};
                            y0 = y0 + data[d].values;
                        }
                    }
                    return ar;
                };
    
            var totalYield = d3.sum(nestedYield, function(d){return d.values;});
        
            var svgBarYield = d3.select('#barYield')
                                .select(".svgBarYield");
            
            //update axis
            scales.barYield.x.domain([0, totalYield]);
    
            var xAxis = d3.svg.axis()
                              .scale(scales.barYield.x)
                              .orient("bottom")
                              .ticks(10, 's');
    
            var xAxisBarYield = svgBarYield.selectAll(".axis")
                                           .call(xAxis);
        
            //remove old data
            svgBarYield.select('g.barYield')
                       .selectAll(".bar")
                       .remove();
    
            //add new data
            var bars = svgBarYield.select('g.barYield')
                                  .selectAll(".bar")
                                  .data(dataBarYield(nestedYield))
                                  .enter()
                                  .append("rect")
                                  .attr("class", "bar")
                                  .attr("y", 0)
                                  .attr('x', function(d) {
                                        return scales.barYield.x(d.y0);
                                  })
                                  .attr("width", function(d) {
                                      return scales.barYield.x(d.value);
                                  })
                                  .attr("height", dimensions.bars.height - dimensions.bars.margin.top - dimensions.bars.margin.bottom)
                                  .attr("fill", function (d) {
                                        return getColor(d.key);
                                  })
                                  .attr('opacity', 0.7);
        };
    
    /*
    Fill line chart with aggregated data
     */

    var fillAccumulatedTimeline = function(data){
            //retrieve current options
            var buttonAggregation = d3.select('#accumulatedTimelineButtons')
                .select('.buttonAggregation');

            var buttonScale = d3.select('#accumulatedTimelineButtons')
                .select('.buttonScale');

            var optionAggregation = buttonAggregation.classed('Count') ? 'Count' : 'Yield',
                optionScale = buttonScale.classed('Relative') ? 'Relative' : 'Absolute';

            //aggregate data
            var nestedData;

            if (optionAggregation === 'Count'){
                nestedData = d3.nest()
                               .key(function(d) {return d.datetime.getUTCFullYear().toString();})
                               .key(function(d) {return d.Country;})
                               .sortKeys(function(a, b) {return countryColorsMap.get(a).id - countryColorsMap.get(b).id;})
                               .rollup(aggregatedCount)
                               .entries(data);
            }else{
                nestedData = d3.nest()
                               .key(function(d) {return d.datetime.getUTCFullYear().toString();})
                                .key(function(d) {return d.Country;})
                                .sortKeys(function(a, b) {return countryColorsMap.get(a).id - countryColorsMap.get(b).id;})
                               .rollup(aggregatedYield)
                               .entries(data);
            }
            var relativeScale = d3.scale.linear()
                .range([0,1]);


            var stackedData= (function(data){
                                var ar = [];
                                var y0;
                                var total;
                                for (var year in data){
                                    if (data.hasOwnProperty(year)){
                                        var arYear = {'key' : +data[year].key, 'values' : []};
                                        y0 = 0;
                                        if (optionScale === 'Relative') {
                                            total = d3.sum(data[year].values, function (d) {
                                                return d.values;
                                            });
                                        }
                                        for (var country in data[year].values){

                                            if (data[year].values.hasOwnProperty(country)) {
                                                var arCountry = {'key' : data[year].values[country].key, 'values' : null};
                                                var ydiff = data[year].values[country].values;
                                                if (optionScale === 'Relative'){
                                                    relativeScale.domain([0, total]);
                                                    ydiff = relativeScale(ydiff)
                                                }
                                                arCountry.values = {
                                                    'year' : +data[year].key,
                                                    'y0': y0,
                                                    'y1': y0 + ydiff,
                                                    'value': ydiff
                                                };
                                                y0 = y0 + ydiff;
                                            }
                                            arYear.values.push(arCountry);
                                        }
                                        ar.push(arYear);
                                    }

                                }
                                return ar;
                            })(nestedData);

            var accumulatedTimeline = d3.select("#accumulatedTimeline")
                                        .select('svg')
                                        .select('g.accumulatedTimeline');


            //set y-axis domains according to aggregated data and add them to the chart
            if (optionScale === 'Relative') {
                scales.timeBar.y.domain([0, 1]);
            } else{
                scales.timeBar.y.domain([0, d3.max(stackedData, function (d) {
                    return d3.sum(d.values, function (d) {
                        return d.values.value;
                    });
                })]);
            }

            var yAxis = d3.svg.axis()
                           .scale(scales.timeBar.y)
                           .orient("left");

            var yAxisTimeline = accumulatedTimeline.selectAll(".y1")
                                                   .call(yAxis);

            accumulatedTimeline.selectAll('.layer').remove();

            var year = accumulatedTimeline.selectAll('.layer')
                                            .data(stackedData)
                                            .enter()
                                            .append("g")
                                            .attr("class", "layer");


            var rect = year.selectAll("rect")
                            .data(function(d){
                                return d.values;});

            rect.enter()
                .append("rect")
                .attr("x", function(d){
                    return scales.timeBar.x(d.values.year);
                })
                .attr('y', function(d) {
                    return scales.timeBar.y(d.values.y1);
                })
                .attr("width", function() {
                    return scales.timeBar.x.rangeBand()-1;
                })
                .attr("height", function(d){
                    return scales.timeBar.y(d.values.y0)-scales.timeBar.y(d.values.y1);
                })
                .attr('opacity', 0.7)
                .attr('value', function(d){return d.values.value})
                .attr("fill", function (d) {
                    return getColor(d.key);
                });

            var yAxis = d3.svg.axis()
                            .scale(scales.timeBar.y)
                            .orient("left");

            var yAxisLine =  accumulatedTimeline.select(".y")
                                                .call(yAxis)
                .select('.label')
                .text(optionScale + ' ' + optionAggregation)
        };


    
    /*
    Fill map
     */
    
    var fillMap = function(data) {
            var tooltip = d3.select("#map")
                            .select('.tooltip');

            //creating circle elements
            var circles = d3.select("#map")
                            .select(".svgMap")
                            .selectAll("circle")
                            .data(data, function(d){
                                return d.index;
                            })
                            .attr('r', function(d) {
                                return getRadius(d['max_yield'], data);
                            });

            //entering new circles
            circles.enter()
                   .append("circle")
                   .attr('cx', function(d) {
                        return d.coords[0];
                   })
                   .attr('cy', function(d) {
                        return d.coords[1];
                   })
                   .attr('r', 1)
                   .attr('fill', 'rgba(0, 0, 0, 0)')
                   .attr('stroke', function(d) {
                        return getColor(d.Country);
                   })
                   .attr('stroke-width', 1.5)
                   .attr('opacity', 0.7)
                   .attr('index', function(d){return d.index;})
                   .on("mouseover", function(d) {
                        tooltip.transition()
                               .duration(200)
                               .style("opacity", .9);
                        tooltip.html(tooltipText(d))
                               .style("left", (d3.event.pageX + 20) + "px")
                               .style("top", (d3.event.pageY - 28) + "px");
                        onCoordOver(this);
                   })
                   .on("mouseout", function() {
                        tooltip.transition()
                               .duration(500)
                               .style("opacity", 0);
                        onCoordOut(this, data);
                   });

            if(data.length != 0){
                if ($("#activeAnimation").hasClass("Animation")){
                    d3.select("#map")
                        .select(".svgMap")
                        .selectAll("circle")
                        .transition().duration(1000)
                        .attr('r', function(d) {
                            return getRadius(d['max_yield'], data) + 10;
                        });

                    d3.select("#map")
                        .select(".svgMap")
                        .selectAll("circle")
                        .transition().delay(1250).duration(1000)
                        .attr('r', function(d) {
                            return getRadius(d['max_yield'], data);
                        });
                } else {
                    d3.select("#map")
                        .select(".svgMap")
                        .selectAll("circle")
                        .attr('r', function(d) {
                            return getRadius(d['max_yield'], data);
                        });
                }
            }


            // removing filtered out data points
            circles.exit()
                .remove();
        };

    /*
    Fill timeline
     */

    var fillTimeline = function(data) {
            var tooltip = d3.select("#timeline")
                            .select('.tooltip');
    
            // Create circles
            var circles = d3.select("#timeline")
                            .select("svg")
                            .select('g.scatter')
                            .selectAll("circle")
                            .data(data, function (d) {
                                return d.index;
                            });
    
            // Enter new data
            circles.enter()
                   .append("circle")
                   .classed('greyed', false)
                   .attr('r', function (d) {
                        return getRadius(d['max_yield'], data);
                   })
                   .attr("cx", function (d) {
                        return scales.scatter.x(d.datetime);
                   })
                   .attr("cy", function (d) {
                        return scales.scatter.y(d.max_yield);
                   })
                   .attr("fill", function (d) {
                        return getColor(d.Country);
                   })
                   .attr("opacity", 0.3)
                   .attr('stroke', function (d) {
                        return getColor(d.Country);
                   })
                   .attr('stroke-width', 1.5)
                   .attr('stroke-opacity', 0.7)
                   .attr('index', function (d) {
                        return d.index;
                   })
                   .on("mouseover", function (d) {
                        tooltip.transition()
                               .duration(200)
                               .style("opacity", .9);
                        tooltip.html(tooltipText(d))
                               .style("left", (d3.event.pageX + 20) + "px")
                               .style("top", (d3.event.pageY - 28) + "px");
                        onPointOver(this);
                   })
                   .on("mouseout", function () {
                        tooltip.transition()
                               .duration(500)
                               .style("opacity", 0);
                        onPointOut(this, data);
                   });
        
            circles.exit().remove();
        };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // UPDATE PLOTS
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    var  updatePlots = function(data){
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

            //deal with the case that the brush was not used yet

            if (brush_ext[1][0] == minDate || brush_ext[0][1] > 100000){
                brush_ext = [[minDate, 0.00001],[maxDate, 55000]];
            }

            var selectedCountries = getSelectedCountries();
            
            /*
             set form values
             */
            
            //dates
            $( "#datePickerMin" ).datepicker( "setDate", brush_ext[0][0]);
            $( "#datePickerMax" ).datepicker( "setDate", brush_ext[1][0]);
        
            //yield
            d3.select('input#minYield')
              .attr('value', brush_ext[0][1]);
            d3.select('input#maxYield')
              .attr('value', brush_ext[1][1]);
        
            /*
            Grey out filtered out points in timeline
             */

            if (brush_ext[0][1] <= 90000){
                d3.select("#timeline")
                  .select(".svgTimeline")
                  .select('g.scatter')
                  .selectAll("circle")
                  .classed("greyed", function(d) {
                                            return d.datetime <= brush_ext[0][0] 
                                                || d.datetime >= brush_ext[1][0]
                                                || d.max_yield <= brush_ext[0][1]
                                                || d.max_yield >= brush_ext[1][1];
                                        });
            } else{
                d3.select("#timeline")
                    .select(".svgTimeline")
                    .select('g.scatter')
                    .selectAll(".greyed")
                    .classed("greyed", function(d) {
                                                return selectedCountries.indexOf(d.Country) == -1;
                                            });
            }
        
            /*
            filter data
             */
        
            var filteredCountry,
                filteredComplete;
        
            filteredCountry = data.filter(function(d){
                                                if (selectedCountries.indexOf(d.Country) !== -1){
                                                    return d;
                                                }
                                            });
        
            if (brush_ext[0][1] > 55000){
                filteredComplete = filteredCountry;
            }else {
                filteredComplete = filteredCountry.filter(function(d) {
                                                                return d.datetime >= brush_ext[0][0]
                                                                    && d.datetime <= brush_ext[1][0]
                                                                    && d.max_yield >= brush_ext[0][1]
                                                                    && d.max_yield <= brush_ext[1][1];
                                                            });
            }

            /*
            Apply filters
             */
            fillAccumulatedTimeline(filteredCountry);
            fillTimeline(filteredCountry);
            fillMap(filteredComplete);
            fillBarCount(filteredComplete);
            fillBarYield(filteredComplete);
        };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // IMPLEMENT FILTERS
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /*
    countries
     */
    
    var filterCountries = function(data){
            // Nest the entries by symbol
            var dataLegend = d3.nest()
                             .key(function(d) {return d.id;})
                             .sortKeys(d3.ascending)
                             .entries(countryColors);
        
            var legendSpace = (dimensions.legend.width - dimensions.legend.margin.left - dimensions.legend.margin.right) / dataLegend.length;
    
            var svgLegend = d3.select('div#legendCountries')
                              .select('g.legend');
        
            // Loop through each symbol / key
            dataLegend.forEach(function(d, i) {
                svgLegend.append("circle")
                         .attr('class', 'legendCircle')
                         .attr("cx", (legendSpace / 2) + i * legendSpace)
                         .attr("cy", 30)
                         .attr('r', dimensions.legend.width / 50)
                         .attr('opacity', 0.9)
                         .attr('id', function(){return d.values[0].country;})
                         .classed('active', true)
                         .style("fill", function() {
                                return d.values[0].color})
        
                svgLegend.append("text")
                         .attr("x", (legendSpace / 2) + i * legendSpace)
                         .attr("y", 75)
                         .attr("class", "legend")
                         .text(d.values[0].country);
            });
    };
    
    /*
    button to select all countries
     */

    var selectAllCountries = function(data){
            d3.select('#legendCountries')
              .selectAll('circle')
              .classed('active', true)
              .transition()
              .duration(200)
              .style("opacity", 0.9);
        
            updatePlots(data);
        };

    /*
     button to deselect all countries
     */
    
    var deselectAllCountries = function(data){
            d3.select('#legendCountries')
                .selectAll('circle')
                .classed('active', false)
                .transition()
                .duration(200)
                .style("opacity", 0.5);
            
            updatePlots(data);
        };

    /*
    button to deselect all filters
     */

    var removeAllFilters = function(data) {
            d3.select("#timeline")
              .select("svg")
              .select('g.scatter')
              .selectAll(".greyed")
              .classed("greyed", false);
        
            d3.selectAll(".brush")
              .call(brush.clear());
        
            selectAllCountries(data);
        };

    /*
    retrieve form data and apply it to brush
     */
    
    var brushControl = function(){
            //dates
            var minDate = d3.select('input#datePickerMin').node().value,
                maxDate = d3.select('input#datePickerMax').node().value;
            var formatDatePicker = d3.time.format("%m/%d/%Y");
            var minDateFormatted = formatDatePicker.parse(minDate),
                maxDateFormatted = formatDatePicker.parse(maxDate);
        
        
            //yield
            var minYield = d3.select('input#minYield').node().value;
            var maxYield = d3.select('input#maxYield').node().value;
        
            //draw brush
            brush.extent([[minDateFormatted, minYield],[maxDateFormatted, maxYield]]);
            brush(d3.select(".brush")
                    .transition());
            brush.event(d3.select(".brush")
                          .transition()
                          .delay(1000));
        };


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // IMPLEMENT ANIMATION
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    

    var getSliderData = function(data){
        var animSpeedSelection = $( "#animSpeed option:selected" ).text();
        var sliderDate = slider.slider('option', 'value');
        console.log(sliderDate)

        var year;
        var month;
        var day;

        var filteredData;
        var dateString;

        if (animSpeedSelection == "Days"){
            sliderDate = new Date(sliderDate * 1000)
            year = sliderDate.getUTCFullYear();
            month = sliderDate.getUTCMonth();
            day = sliderDate.getUTCDate();
            filteredData = data.filter(function(d){
                if (d.datetime.getUTCFullYear() == year
                    && d.datetime.getUTCMonth() == month
                    && d.datetime.getUTCDate() == day){
                    return d;
                }
            });
            dateString = "<p class = 'align-center large'><b>{0}. {1} {2}</p>".format(day, months[month], year)
        } else if (animSpeedSelection == "Months"){
            year = Math.floor(sliderDate / 12) + 1945;
            month = sliderDate % 12;
            filteredData = data.filter(function(d){
                if (d.datetime.getUTCFullYear() == year
                    && d.datetime.getUTCMonth() == month){
                    return d;
                }
            });
            dateString = "<p class = 'align-center large'><b>{0} {1}</p>".format(months[month], year)
        } else{
            year = sliderDate;
            filteredData = data.filter(function(d){
                if (d.datetime.getUTCFullYear() == year){
                    return d;
                }
            });
            dateString = "<p class = 'align-center large'><b>{0}</b></p>".format(year)
        }

        return [filteredData, dateString];
    };

    var applyStep = function(filteredData, slider, dateString){
        document.getElementById("rowShowDate").innerHTML = dateString;
        console.log(dateString, filteredData)
        fillMap(filteredData);
    };

    var playAnimation = function(data){
        //setInterval(stepForward, 5, data)
        //setInterval does not allow to change interval time, thus due to a lot of months without events, the animation might
        // get boring

        var steps = (slider.slider('option', 'max') - slider.slider('option', 'value')) / slider.slider('option', 'step');
        var timeout;

        (function playLoop(i){
            if ($("div#rowShowDate").hasClass('paused')){
                return;
            }
            if ($("div#rowShowDate").hasClass('stopped')){
                slider.slider('value', slider.slider('option', 'min'));
                var sliderData = getSliderData(data);
                applyStep(sliderData[0], slider, sliderData[1]);
                return;
            }
            var sliderData = getSliderData(data);

            setTimeout(function () {
                applyStep(sliderData[0], slider, sliderData[1]);
                slider.slider('value', slider.slider('option', 'value') + slider.slider('option', 'step'));
                if (--i > 0) playLoop(i);
            }, timeout);

            if (sliderData[0].length != 0){
                timeout = 3000;
            }else{
                timeout = 1000;
            }

        })(steps);
    };

    var implementAnimButtons = function(data){
        var sliderData = getSliderData(data);
        applyStep(sliderData[0], slider, sliderData[1]);

        $('button#animationBack')
            .off('click')
            .on('click', function(){
                slider.slider('value', slider.slider('option', 'value') - slider.slider('option', 'step'));
                var sliderData = getSliderData(data);
                applyStep(sliderData[0], slider, sliderData[1]);
            });

        $('button#animationPlay')
            .off('click')
            .on('click', function(){
                if ($("div#rowShowDate").hasClass('paused')){
                    $("div#rowShowDate").removeClass('paused');
                }
                if ($("div#rowShowDate").hasClass('stopped')){
                    $("div#rowShowDate").removeClass('stopped');
                }
                playAnimation(data);
            });

        $('button#animationPause')
            .off('click')
            .on('click', function(){
                $("div#rowShowDate").toggleClass('paused');
            });

        $('button#animationStop')
            .off('click')
            .on('click', function(){
                $("div#rowShowDate").toggleClass('stopped');
            });

        $('button#animationForward')
            .off('click')
            .on('click', function(){
                slider.slider('value', slider.slider('option', 'value') + slider.slider('option', 'step'));
                var sliderData = getSliderData(data);
                applyStep(sliderData[0], slider, sliderData[1]);
            });

        $( "#animSpeed" ).change(function(){
            var sliderData = getSliderData(data);
            applyStep(sliderData[0], slider, sliderData[1]);
        });

        slider.slider({stop : function(){
            var sliderData = getSliderData(data);
            applyStep(sliderData[0], slider, sliderData[1]);
        }})
    };

    var switchInterface = function(data){
        if ($("#activeAnimation").attr('value') == 'Animation'){
            implementAnimButtons(data);
            d3.select('div#legendCountries')
                .selectAll('circle')
                .on('click', null)
        }else{
            d3.select('div#legendCountries')
                .selectAll('circle')
                .on('click', function(){
                    var active   = d3.select(this).classed('active') ? false : true,
                        newOpacity = active ? 0.9 : 0.5;
                    d3.select(this)
                        .classed('active', function(){return active; })
                        .transition()
                        .duration(200)
                        .style("opacity", newOpacity);
                    updatePlots(data);
                });
            $("div#rowShowDate").toggleClass('stopped');
        }
    };

    var implementAnimInterface = function(data){
        switchInterface(data);
        $("#activeAnimation").off('click').on('click', function(event) {
            console.log(event)
            $('.control').toggle();
            var animationButton = $("#activeAnimation");
            var buttonValue = animationButton.attr('value');
            buttonValue = buttonValue == 'Exploration' ? 'Animation' : 'Exploration';
            animationButton.attr('value', buttonValue)
                           .toggleClass('Animation');
            console.log($("#activeAnimation").attr('value'))
            switchInterface(data);

        });
    };


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // EXECUTE
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    //draw map
    d3.json("../data/map/world_countries.json",
        function (d){
            drawMap(d)
        });

    //create data dependent objects
    d3.csv("../data/preproc_nuclear_weapon_tests.csv",
        function (d) {
            return loadData(d);
        },
        function (d) {
            //Draw control elements
            buildAccumulatedTimeline(d);
            drawCountryLegend();
            buildFilterForm(d);

            //Implement controls
            filterCountries(d);

            //Draw viz frameworks
            drawBarCount();
            drawBarYield();
            drawAccumulatedTimeline();
            drawTimeline(d);

            implementAnimInterface(d);

            //Fill Plots
            updatePlots(d);

        });

}

(function(){draw()})();


