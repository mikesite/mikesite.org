<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="author" content="PhoenixTheHunter">
<meta name="description" content="Badge Generator to visualize campaign progress from Card Hunter">
<meta name="keywords" content="Blue Manchu, Card Hunter, util, utils, utility, utilities, PhoenixTheHunter, Campaign Badge">
<title>Campaign Badge, Card Hunter Utilities, by PhoenixTheHunter</title>
<link rel="icon" type="image/png" sizes="32x32" href="../favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="../favicon-16x16.png">
<link rel="stylesheet" type="text/css" href="../layout/corporate-design.css">
<link rel="stylesheet" type="text/css" href="../layout/signature.css">
<link rel="stylesheet" type="text/css" href="../layout/primitives.css">
<link rel="stylesheet" type="text/css" href="../layout/layout-center.css">
<link rel="stylesheet" type="text/css" href="../layout/selection-table.css">
<style type="text/css">
#details {
	padding: 0 5px;
}
</style>
<script type="text/javascript" src="../external/rgbcolor.min.js"></script>
<script type="text/javascript" src="../external/stackblur.min.js"></script>
<script type="text/javascript" src="../external/canvg.min.js"></script>
<script type="text/javascript" src='../script/dom/expander.js'></script>
<script data-main="../script/badges/campaign-badge.js" src="../external/require.js"></script>
</head>
<body>
<?php echo file_get_contents('../layout/signature.xml');?>
<h4 id="instructions-header" class="expander">Instructions (click to show/hide)</h4>
<ol id="instructions" class="expandable">
<li>Go to the campaign map.</li>
<li>Open the console by pressing [F1] twice.</li>
<li>Type "cls" and press [return].</li>
<li>Type "getlocalcampaignflags" and press [return].</li>
<li>Type "clip" and press [return].</li>
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
		<td><label><input type="checkbox" id="includeGen3" checked/>Caverns of Chaos</label></td>
		<td><label><input type="checkbox" id="includeGen4" checked/>AI Set</label></td>
		<td><label><input type="checkbox" id="includeGen5" checked/>CM Set</label></td>
	</tr>
</table>
<br>
<table class='selection'>
	<tr>
		<td><label><input type="checkbox" id="includeLocked"/>include locked Adventures</label></td>
		<td><label><input type="checkbox" id="includeMM"/>include Mauve Manticore</label></td>
	</tr>
</table>
</div>
<button id="bProcess">Process Data</button>
<br><br>
<h4 id="details-header" class="expander">Adventure details (click to show/hide)</h4>
<div id="details" class="expandable"><i>Process your log to see any adventure details.</i></div>
<br>
<div id="results"></div>
<div id='adventuresData' class='data'><?php include_once("../fetch-resource.php"); echo fetchResource("Adventures");?></div>
</body>
</html>
