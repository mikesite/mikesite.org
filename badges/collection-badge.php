<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="author" content="PhoenixTheHunter">
<meta name="description" content="Badge Generator to visualize collection completeness from Card Hunter">
<meta name="keywords" content="Blue Manchu, Card Hunter, util, utils, utility, utilities, PhoenixTheHunter, Collection Badge">
<title>Collection Badge, Card Hunter Utilities, by PhoenixTheHunter</title>
<link rel="icon" type="image/png" sizes="32x32" href="../favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="../favicon-16x16.png">
<link rel="stylesheet" type="text/css" href="../layout/corporate-design.css">
<link rel="stylesheet" type="text/css" href="../layout/signature.css">
<link rel="stylesheet" type="text/css" href="../layout/primitives.css">
<link rel="stylesheet" type="text/css" href="../layout/layout-center.css">
<link rel="stylesheet" type="text/css" href="../layout/selection-table.css">
<script type="text/javascript" src="../external/rgbcolor.min.js"></script>
<script type="text/javascript" src="../external/stackblur.min.js"></script>
<script type="text/javascript" src="../external/canvg.min.js"></script>
<script type="text/javascript" src='../script/dom/expander.js'></script>
<script data-main="../script/badges/collection-badge.js" src="../external/require.js"></script>
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
<li>Enter the Keep</li>
<li>Open the console by pressing [F1] twice.</li>
<li>Type "clip" and press [return].</li>
<li>Type "verbose" and press [return].</li>
<li>Paste the log data into the text area below.</li>
<li>Click "Process Data".</li>
</ol>
<textarea id="taLogData" placeholder="copy and paste your data here"></textarea>
<div class="options">
<table class='selection'>
	<tr>
		<td><label><input type="checkbox" id="includeGen0" checked/>Base Set</label></td>
		<td><label><input type="checkbox" id="includeGen1" checked/>AotA Set</label></td>
		<td><label><input type="checkbox" id="includeGen2" checked/>EttSC Set</label></td>
	</tr>
	<tr>
		<td><label><input type="checkbox" id="includeGen3" checked/>Aloyzo Set</label></td>
		<td><label><input type="checkbox" id="includeGen4" checked/>AI Set</label></td>
		<td><label><input type="checkbox" id="includeGen5" checked/>CM Set</label></td>
	</tr>
</table>
<br>
<table class='selection'>
	<tr>
		<td><label><input type="checkbox" id="includeTreasure" checked/>include Treasures</label></td>
		<td><label><input type="checkbox" id="includeNoLoot"/>include Undroppables</label></td>
	</tr>
	<tr>
		<td><label><input type="checkbox" id="maxUsable"/>max usable</label></td>
	</tr>
</table>
</div>
<button id="bProcess">Process Data</button>
<br><br>
<div id="results"></div>
<div id='equipmentData' class='data'><?php include_once("../fetch-resource.php"); echo fetchResource("Equipment");?></div>
</body>
</html>
