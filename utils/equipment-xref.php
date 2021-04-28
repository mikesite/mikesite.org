<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="author" content="PhoenixTheHunter">
<meta name="description" content="Cross Referencer for collection export from Card Hunter">
<meta name="keywords" content="Blue Manchu, Card Hunter, util, utils, utility, utilities, PhoenixTheHunter, Equipment Xref">
<title>Equipment Xref, Card Hunter Utilities, by PhoenixTheHunter</title>
<link rel="icon" type="image/png" sizes="32x32" href="../favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="../favicon-16x16.png">
<link rel="stylesheet" type="text/css" href="../layout/corporate-design.css">
<link rel="stylesheet" type="text/css" href="../layout/signature.css">
<link rel="stylesheet" type="text/css" href="../layout/primitives.css">
<link rel="stylesheet" type="text/css" href="../layout/layout-center.css">
<script type="text/javascript" src='../script/dom/expander.js'></script>
<script data-main="../script/utils/equipment-xref.js" src="../external/require.js"></script>
</head>
<body>
<?php echo file_get_contents('../layout/signature.xml');?>
<h4 id="instructions-header" class="expander">Data Formatting (click to show/hide)</h4>
<ul id="instructions" class="expandable">
<li>Data must be comma-separated</li>
<li>The first row of data is parsed as column headers</li>
<li>Data must have an "Item" column which contains the item id.</li>
<li>All fields are preserved by the transformation.</li>
<li>All item data is appended after supplied fields.</li>
</ul>
<textarea id="taInput" placeholder="copy and paste your data here"></textarea>
<div class="options">
<label><input type="checkbox" id="doReverseMerge"/>reverse merge
<br><span style="font-size: 80%">(Output a row for each item in the master file. Only merges the first input row for each item.)</span>
</label>
</div>
<button id="bProcess">Process Data</button>
<textarea id="taOutput" placeholder="output will appear here" readonly></textarea>
<div id='equipmentData' class='data'><?php include_once("../fetch-resource.php"); echo fetchResource("Equipment");?></div>
</body>
</html>
