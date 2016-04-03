<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">

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
        <script src="./js/libs/jquery.js"></script>

        <script language="JavaScript" type="text/javascript">
            <!--
            function changeFrame(newPage){
                document.getElementById("contentFrame").src = newPage;
            }
            //-->
        </script>

    </head>

    <body>
        <div class = "container">
            <div id = "header" class="row padded asphalt">
                <h1>Nuclear Weapon Tests from 1945 - 1998</h1>
            </div>

            <div id = "Introduction" class="row justify padded asphalt">
                <p>
                    This visualization shows all nuclear weapon explosions from 1945 to 1998. Astonishingly there were
                    more than 2000 explosions. The huge scale of nuclear weapon tests is unknown to most people, but nevertheless
                    has health and environment effects until today. Having awareness about these events might be
                    important to prevent further tests on this scale. This prompted Isao Hashimoto to make an amazing <a
                        href ="http://www.ctbto.org/specials/1945-1998-by-isa­o-hashimoto/" target="_blank"> video </a>.
                    This visualization aims to present the data in a more interactive form. So have fun exploring the data
                    of nuclear weapon testing.
                </p>
                
                <p>
                    The data shows some interesting events in the history of the cold war. For example the Bilateral testing ban
                    between 1958 and 1961, marked by no nuclear weapon explosions initiated by the USA or USSR. The explosion of the biggest
                    nuclear weapon tested: the Zar Bomb in 1961. Also that from the sixties on there seem to be standardized
                    bomb sizes that were tested.
                </p>
            </div>

            <div class="row padded">
                <nav role="navigation" class="nav asphalt">
                    <ul>
                        <li>
                            <a href="./pages/visualization.html" id="vizLink" onClick="changeFrame(this.href); return false;">Visualization</a>
                        </li>
                        <li>
                            <a href="./pages/design.html" id="default" onClick="changeFrame(this.href); return false;">Design</a>
                        </li>
                        <li>
                            <a href="./pages/feedback.html" id="default" onClick="changeFrame(this.href); return false;">Feedback</a>
                        </li>
                        <li>
                            <a href="./pages/resources.html" id="default" onClick="changeFrame(this.href); return false;">Resources</a>
                        </li>
                        <li>
                            <a href="./pages/dataset.php" id="default" onClick="changeFrame(this.href); return false;">Data Set</a>
                        </li>
                        <li>
                            <a href="./pages/sourcecode.html" id="default" onClick="changeFrame(this.href); return false;">Source Code</a>
                        </li>
                        <li>
                            <a href="./pages/contact.html" id="default" onClick="changeFrame(this.href); return false;">Contact</a>
                        </li>
                    </ul>
                </nav>
            </div>

            <div class = "row half-padded"></div>

            <div id = 'containerText' class="row padded">
                <iframe src="./pages/visualization.html" id = 'contentFrame' style = "width : 100%;"></iframe>
            </div>

            <script type="text/javascript" language="javascript">
                $('#contentFrame').css('height', $(window).height()+'px');

                $(window).resize(function(){
                    if (document.getElementById("contentFrame").src.search('visualization.html') != -1){
                        changeFrame('./pages/visualization.html');
                    }
                });
            </script>

        <script type="text/javascript" src="./js/groundwork.all.js"></script>
    </body>
</html>