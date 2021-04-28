<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="author" content="PhoenixTheHunter">
<meta name="description" content="Analyzer for shop excess from Card Hunter">
<meta name="keywords" content="Blue Manchu, Card Hunter, util, utils, utility, utilities, PhoenixTheHunter, Shop Excess Calculator">
<title>Shop Excess Calculator, Card Hunter Utilities, by PhoenixTheHunter</title>
<link rel="icon" type="image/png" sizes="32x32" href="../favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="../favicon-16x16.png">
<link rel="stylesheet" type="text/css" href="../layout/corporate-design.css">
<link rel="stylesheet" type="text/css" href="../layout/signature.css">
<link rel="stylesheet" type="text/css" href="../layout/primitives.css">
<link rel="stylesheet" type="text/css" href="../layout/layout-center.css">
<link rel="stylesheet" type="text/css" href="../layout/excess-table.css">
<script type="text/javascript" src='../script/dom/expander.js'></script>
<script data-main="../script/utils/shop-excess.js" src="../external/require.js"></script>
</head>
<body>
<?php echo file_get_contents('../layout/signature.xml');?>
<h4 id="instructions-header" class="expander">Instructions (click to show/hide)</h4>
<ol id="instructions" class="expandable">
<li>Go to the campaign map.</li>
<li>Open the console by pressing [F1] twice.</li>
<li>Type "cls" and press [return].</li>
<li>Type "verbose" and press [return].</li>
<li>Close the console by pressing [F1] once.</li>
<li>Enter a shop.
<ul><li>The tool will only process one shop at a time.</li>
<li>Repeat the procedure for every shop you want to analyze.</li></ul>
</li>
<li>Open the console by pressing [F1] twice.</li>
<li>Type "clip" and press [return].</li>
<li>Type "verbose" and press [return].</li>
<li>Paste the log data into the text area below.</li>
<li>Click "Process Data".</li>
</ol>
<textarea id="taLogData" placeholder="copy and paste your data here"></textarea>
<div class="options">
<label><input type="checkbox" id="includeTreasure" checked/>include Treasure</label>
</div>
<button id="bProcess">Process Data</button>
<br><br>
<div id="results"></div>
<div id='equipmentData' class='data'><?php include_once("../fetch-resource.php"); echo fetchResource("Equipment");?></div>
</body>
</html>
