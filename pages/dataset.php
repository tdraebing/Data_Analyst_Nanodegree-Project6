<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Data Set</title>

    <!-- Modernizr -->
    <script src="../js/libs/modernizr-2.6.2.min.js"></script>
    <!-- framework css -->
    <!--[if gt IE 9]><!-->
    <link type="text/css" rel="stylesheet" href="../css/groundwork.css">
    <!--<![endif]-->
    <!--[if lte IE 9]>
    <link type="text/css" rel="stylesheet" href="../css/groundwork-core.css">
    <link type="text/css" rel="stylesheet" href="../css/groundwork-type.css">
    <link type="text/css" rel="stylesheet" href="../css/groundwork-ui.css">
    <link type="text/css" rel="stylesheet" href="../css/groundwork-anim.css">
    <link type="text/css" rel="stylesheet" href="../css/groundwork-ie.css">
    <![endif]-->
    <script src="../js/libs/jquery.js"></script>
</head>
<body>
<div class = 'container asphalt justify'>
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


<script type="text/javascript" src="../js/groundwork.all.js"></script>
</body>
</html>