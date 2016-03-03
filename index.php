<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">

    <script src='http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js'></script>
    <script src="http://d3js.org/d3.v3.min.js"></script>
    <script src="./js/viz.js"></script>
    <script type="text/javascript">
        draw();
    </script>

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

    <link rel="stylesheet" href="./css/viz.css">
</head>
<body>

<div class = "container asphalt-bg padded">
    <div id = "header" class="row  asphalt-bg">
        <h1>Nuclear Weapon Tests from 1945 - 1998</h1>
    </div>

    <div id = 'text-container' class="row">
        <div class="tabs">
            <ul role="tablist">
                <li role="tab" aria-controls="#summary">Summary</li>
                <li role="tab" aria-controls="#design">Design</li>
                <li role="tab" aria-controls="#feedback">Feedback</li>
                <li role="tab" aria-controls="#resources">Resources</li>
                <li role="tab" aria-controls="#story">Notable observations</li>
            </ul>
            <div id="summary" role="tabpanel">
                This visualization shows all nuclear weapon explosions from 1945 to 1998. Astonishingly there were
                more than 2000 explosions. The huge scale of nuclear weapon tests is mostly unknown, but nevertheless
                has health and environment effects until today. Having awareness about these events might be
                important to prevent further tests on this scale. This prompted Isao Hashimoto to make an amazing <a
                    href ="http://www.ctbto.org/specials/1945-1998-by-isa­o-hashimoto/" target="_blank"> video </a>.
                This visualization aims to present the data in a more interactive form.
            </div>
            <div id="design" role="tabpanel">
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
            <div id="feedback" role="tabpanel">
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
            <div id="resources" role="tabpanel">
                <h3>Data Source</h3>
                <p><b>Original Paper: </b><a href = "http://www.ldeo.columbia.edu/~richards/my_papers/WW_nuclear_tests_IASPEI_HB.pdf">Yang et al., Worldwide Nuclear Explosions</a></p>
                <p><b>Map: </b><a href = "https://www.udacity.com/course/viewer#!/c-ud507-nd">Udacity's Data Visualization and d3.js</a></p>
                <p></br></p>
                <h3>Software and Frameworks</h3>
                <p><b>IDE: </b><a href = "https://www.jetbrains.com/phpstorm/">PhpStorm 10.0.3 by JetBrains (Educational License)</a></p>
                <p><b>PHP Interpreter: </b><a href = "https://sourceforge.net/projects/xampp/">XAMPP</a></p>
                <p><b>D3.js: </b><a href = "http://d3js.org">d3js.org</a></p>
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
                <p><b>Interactive Legend: </b><a href = "http://bl.ocks.org/d3noob/5d621a60e2d1d02086bf">D3Noob</a></p>
                <p><b>Misc: </b><a href = "http://stackoverflow.com">A lot of Stackoverflow</a></p>

            </div>
            <div id="story" role="tabpanel">

            </div>
        </div>
    </div>
    <div id = "graphics" class = "row white-bg">
        <div id = "map" class = "row gapped"></div>
        <div id = "timescatter" class = "row gapped"></div>
        <div id = "country_legend" class = "row gapped"></div>
    </div>
    <div id = "button_container" class = "row gapped">
        <div id = "bc_countries" class = "six twelfth">
            <div id = "b_deselect" class = "skip-two four twelfth"></div>
            <div id = "b_select" class = "four twelfth"></div>
        </div>
        <div id = "bc_selection" class = "two twelfth"></div>
        <div id = "bc_all" class = "skip-one two twelfth"></div>
    </div>

    <div class="tabs">
        <ul role="tablist">
            <li role="tab" aria-controls="#dataproc">Data Preprocessing</li>
            <li role="tab" aria-controls="#data">Data</li>
            <li role="tab" aria-controls="#php">index.php</li>
            <li role="tab" aria-controls="#js">viz.js</li>
            <li role="tab" aria-controls="#css">viz.css</li>
        </ul>
        <div id="dataproc" role="tabpanel" style="overflow : auto;">
            <script src="https://gist.github.com/tdraebing/8af24acaa3a4184156c8.js"></script>
        </div>
        <div id="data" role="tabpanel" style="overflow : auto;">
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
        <div id="php" role="tabpanel" style="overflow : auto;">
            <script src="https://gist.github.com/tdraebing/ccc5fce581c476cae41f.js"></script>
        </div>
        <div id="js" role="tabpanel" style="overflow : auto;">
            <script src="https://gist.github.com/tdraebing/b7838c4f6257d96e460e.js"></script>
        </div>
        <div id="css" role="tabpanel" style="overflow : auto;">
            <script src="https://gist.github.com/tdraebing/057b0ac35166f6c5d5b5.js"></script>
        </div>
    </div>

</div>


<script type="text/javascript" src="./js/libs/jquery-1.10.2.min.js"></script>
<script type="text/javascript" src="./js/groundwork.all.js"></script>
</body>
</html>