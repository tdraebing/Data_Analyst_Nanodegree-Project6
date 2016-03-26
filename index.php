<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">

        <script src="http://d3js.org/d3.v3.min.js"></script>

        <!-- Modernizr -->
        <script src="./js/libs/modernizr-2.6.2.min.js"></script>
        <!-- framework css -->
        <!--[if gt IE 9]><!-->
        <link type="text/css" rel="stylesheet" href="./css/groundwork.css">
        <!--<![endif]-->
        <!--[if lte IE 9]>
        <link type="text/css" rel="stylesheet" href="./css/groundwork-core.css">
        <link type="text/css" rel="stylesheet" href="./css/groundwork-type.css">
        <link type="text/css" rel="stylesheet" href="./css/groundwork-ui.css">
        <link type="text/css" rel="stylesheet" href="./css/groundwork-anim.css">
        <link type="text/css" rel="stylesheet" href="./css/groundwork-ie.css">
        <![endif]-->

        <link href="./css/jquery-ui.css" rel="stylesheet">
        <script src="./js/libs/jquery.js"></script>
        <script src="./js/libs/jquery-ui.js"></script>

        <link rel="stylesheet" href="./css/viz.css">
    </head>

    <body>
        <div class = "container asphalt-bg padded">
            <div id = "header" class="row  asphalt-bg">
                <h1>Nuclear Weapon Tests from 1945 - 1998</h1>
            </div>

            <div id = 'containerText' class="row">
                <div class="tabs">
                    <ul role="tablist">
                        <li role="tab" aria-controls="#tabSummary">Summary</li>
                        <li role="tab" aria-controls="#tabDesign">Design</li>
                        <li role="tab" aria-controls="#tabFeedback">Feedback</li>
                        <li role="tab" aria-controls="#tabResources">Resources</li>
                        <li role="tab" aria-controls="#tabStory">Notable observations</li>
                    </ul>
                    <div id="tabSummary" role="tabpanel">
                        This visualization shows all nuclear weapon explosions from 1945 to 1998. Astonishingly there were
                        more than 2000 explosions. The huge scale of nuclear weapon tests is mostly unknown, but nevertheless
                        has health and environment effects until today. Having awareness about these events might be
                        important to prevent further tests on this scale. This prompted Isao Hashimoto to make an amazing <a
                            href ="http://www.ctbto.org/specials/1945-1998-by-isa­o-hashimoto/" target="_blank"> video </a>.
                        This visualization aims to present the data in a more interactive form.
                    </div>
                    <div id="tabDesign" role="tabpanel">
                        <p>The visualization contains a world map and a scatter plot. The data of the nuclear explosions are
                            represented by different Encodings. The color represents the country, which initiated the explosion.
                            The size of the circle/ring represents the maximum yield of the bomb in a linear scale. The location
                            on the map is also the site of the explosion. The scatter plot additionally gives the time of
                            explosion and the maximum yield on a log-scale.</p>
                        <p>The visualization is interactive. Doing a mouse over over a point will highlight the data point on
                            the map and the scatter plot as well as open a tool tip giving some more information. The data can
                            also be filtered in several ways. Clicking on the respective circles in the legend allows to select
                            or deselect data of countries. For convenience there are also buttons to select all or none at once.
                            The data can further be filtered by dragging a box in the scatter plot to filter for maximum yield
                            and time.</p>
                    </div>
                    <div id="tabFeedback" role="tabpanel">
                        <p><b>Planned Features</b></p>
                        <ul class = "list">
                            <li>Improved responsiveness of visualization</li>
                            <li>Interactive adjustment of circle radii</li>
                            <li>Better scaling of circle radii</li>
                            <li>Improved data representation on map</li>
                            <li>Color Blind Mode (optional different shapes)</li>
                            <li>Zoomable scatter plot</li>
                            <li>Animated time lapse</li>
                            <li>Interactive data table with link to map and plot</li>
                            <li>Adding additional plots. E.g. Medium</li>
                        </ul>
                    </div>
                    <div id="tabResources" role="tabpanel">
                        <h3>Data Source</h3>
                        <p><b>Original Paper: </b><a href = "http://www.ldeo.columbia.edu/~richards/my_papers/WW_nuclear_tests_IASPEI_HB.pdf">Yang et al., Worldwide Nuclear Explosions</a></p>
                        <p><b>Map: </b><a href = "https://www.udacity.com/course/viewer#!/c-ud507-nd">Udacity's Data Visualization and d3.js</a></p>
                        <p></br></p>
                        <h3>Software and Frameworks</h3>
                        <p><b>IDE: </b><a href = "https://www.jetbrains.com/phpstorm/">PhpStorm 10.0.3 by JetBrains (Educational License)</a></p>
                        <p><b>PHP Interpreter: </b><a href = "https://sourceforge.net/projects/xampp/">XAMPP</a></p>
                        <p><b>D3.js: </b><a href = "http://d3js.org">d3js.org</a></p>
                        <p><b>Datepicker: </b><a href = "http://api.jqueryui.com/datepicker/">jQuery UI</a></p>
                        <p><b>CSS Framework: </b><a href = "http://groundworkcss.github.io/groundwork/?url=docs/home">GroundworkCSS 2</a></p>
                        <p><b>PDF Conversion: </b><a href = "http://pdf2docx.com/de/">PDF2DOCX</a></p>
                        <p><b>CSV Generation: </b><a href = "https://products.office.com/de-de/excel">Microsoft Excel 2016</a></p>
                        <p><b>Data Preprocessing: </b><a href = "https://www.r-project.org/">R 3.2.3</a></p>
                        <p><b>Data Preprocessing (IDE): </b><a href = "https://www.rstudio.com/">RStudio 0.99.489</a></p>
                        <p><b>Web Hosting: </b><a href = "https://www.000webhost.com/">000webhost</a></p>
                        <p></br></p>
                        <h3>Help Sources</h3>
                        <p><b>HTML/CSS: </b><a href = "http://www.w3schools.com/w3css/default.asp">W3Schools</a></p>
                        <p><b>D3.js (general): </b><a href = "https://github.com/mbostock/d3/wiki/API-Reference">D3.js API</a></p>
                        <p><b>Maps in D3: </b><a href = "http://maptimeboston.github.io/d3-maptime/#/">Maptime Boston</a></p>
                        <p><b>Tooltips: </b><a href = "https://bl.ocks.org/d3noob/a22c42db65eb00d4e369">D3Noob</a></p>
                        <p><b>Brush Selection: </b><a href = "http://bl.ocks.org/mbostock/4349545">Mike Bostock</a></p>
                        <p><b>Brush Control: </b><a href = "http://bl.ocks.org/timelyportfolio/5c136de85de1c2abb6fc">Timely Portfolio</a></p>
                        <p><b>Interactive Legend: </b><a href = "http://bl.ocks.org/d3noob/5d621a60e2d1d02086bf">D3Noob</a></p>
                        <p><b>Misc: </b><a href = "http://stackoverflow.com">A lot of Stackoverflow</a></p>

                    </div>
                    <div id="tabStory" role="tabpanel">

                    </div>
                </div>
            </div>

            <div id = "containerAnimation" class = "row padded">
                <input type = "button" name = "anim_button" value = "Run Animation" class="block buttonAnimation">
            </div>

            <div id = "containerGraphics" class = "row white-bg" style="overflow : auto;">
                <div id = "containerBars" class = "row">
                    <div id = "barCount" class = "row"></div>
                    <div id = "barYield" class = "row"></div>
                </div>
                <div id = "accumulatedTimeline" class="row"></div>
                <div id = "map" class = "row"></div>
                <div id = "timeline" class = "row"></div>
                <div id = "legendCountries" class = "row"></div>
            </div>

            <div id = "containerFilters" class = "row padded">
                <div class = "row">
                    <div id="containerCircleSizes" class = "two twelfth padded">

                        <p class="centered"><b>Circle Size</b></p>

                        <div id = "minCircleSize" class = "three eighth">
                            <input id="minCircleSize" type="text" placeholder="5" value="5">
                        </div>

                        <div class="two eighth align-center"><b>-</b></div>

                        <div id = "maxCircleSize" class = "three eighth">
                            <input id="maxCircleSize" type="text" placeholder="20" value="20">
                        </div>

                    </div>

                    <div id = "containerDateFilter" class = "skip-one six twelfth padded">

                        <p class="centered"><b>Date Range</b></p>

                        <div id = "containerMinDate" class = "five twelfth">
                            <input type="text" id="datePickerMin" value="01/01/1944">
                        </div>

                        <div class="one twelfth align-center"><b>-</b></div>

                        <div id = "containerMaxDate" class = "five twelfth">
                            <input type="text" id="datePickerMax" value="01/01/1999">
                        </div>

                    </div>

                    <div id = "containerYieldFilter" class = "skip-one two twelfth padded">

                        <p class="centered"><b>Yield Range</b></p>

                        <div id = "minYield" class = "two fifth">
                            <input id="minYield" type="text" placeholder="0.0001"  value="0.0001">
                        </div>

                        <div class="one fifth align-center"><b>-</b></div>

                        <div id = "maxYield" class = "two fifth">
                            <input id="maxYield" type="text" placeholder="50000" value="50000">
                        </div>

                    </div>
                </div>

                <div id="containerUpdateButton" class="row">
                    <div id="buttonUpdateFilter" class="skip-one one third"></div>
                </div>

            </div>

            <div id = "containerButtons" class = "row gapped padded">
                <div id = "containerCountryButtons" class = "six twelfth">
                    <div id = "buttonDeselectAll" class = "skip-two four twelfth"></div>
                    <div id = "buttonSelectAll" class = "four twelfth"></div>
                </div>
                <div id = "buttonRemoveSelection" class = "two twelfth"></div>
                <div id = "buttonRemoveFilters" class = "skip-one two twelfth"></div>
            </div>

            <div class="tabs" style="height : 850px;">
                <ul role="tablist">
                    <li role="tab" aria-controls="#tabData" >Data</li>
                    <li role="tab" aria-controls="#tabDataProcessing">Data Preprocessing</li>
                    <li role="tab" aria-controls="#tabPHP">index.php</li>
                    <li role="tab" aria-controls="#tabJS">viz.js</li>
                    <li role="tab" aria-controls="#tabCSS">viz.css</li>
                </ul>
                <div id="tabData" role="tabpanel" style="height : 800px; overflow : auto;">
                    <?php
                    echo "<html><body><table>\n\n";
                    $f = fopen("./data/preproc_nuclear_weapon_tests.csv", "r");
                    while (($line = fgetcsv($f)) !== false) {
                        echo "<tr>";
                        foreach ($line as $cell) {
                            echo "<td>" . htmlspecialchars($cell) . "</td>";
                        }
                        echo "</tr>\n";
                    }
                    fclose($f);
                    echo "\n</table></body></html>"; ?>
                </div>
                <div id="tabDataProcessing" role="tabpanel" style="height : 800px; overflow : auto;">
                    <script src="https://gist.github.com/tdraebing/8af24acaa3a4184156c8.js"></script>
                </div>
                <div id="tabPHP" role="tabpanel" style="height : 800px; overflow : auto;">
                    <script src="https://gist.github.com/tdraebing/ccc5fce581c476cae41f.js"></script>
                </div>
                <div id="tabJS" role="tabpanel" style="height : 800px; overflow : auto;">
                    <script src="https://gist.github.com/tdraebing/b7838c4f6257d96e460e.js"></script>
                </div>
                <div id="tabCSS" role="tabpanel" style="height : 800px; overflow : auto;">
                    <script src="https://gist.github.com/tdraebing/057b0ac35166f6c5d5b5.js"></script>
                </div>
            </div>
        </div>


        <script src="./js/viz.js"></script>

        <script>
            var fullDateFormat  = d3.time.format("%m/%d/%Y %I:%M:%S %p")
            var minDatePicker = fullDateFormat.parse("1/1/1944 0:00:00 AM"),
                maxDatePicker = fullDateFormat.parse("1/1/2000 0:00:00 AM");

            $( "#datePickerMin" ).datepicker({
                changeYear: true,
                changeMonth: true,
                yearRange: "1944:1999",
                minDate: minDatePicker,
                maxDate: maxDatePicker,
                defaultDate: minDatePicker
            });
            $( "#datePickerMax" ).datepicker({
                changeYear: true,
                changeMonth: true,
                yearRange: "1944:1999",
                minDate: minDatePicker,
                maxDate: maxDatePicker,
                defaultDate: maxDatePicker
            });
        </script>

        <script type="text/javascript" src="./js/groundwork.all.js"></script>
    </body>
</html>