<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="author" content="PhoenixTheHunter">
<meta name="description" content="Generator of card images for Card Hunter">
<meta name="keywords" content="Blue Manchu, Card Hunter, util, utils, utility, utilities, PhoenixTheHunter, Card Generator">
<title>Card Generator, Card Hunter Utilities, by PhoenixTheHunter</title>
<link rel="icon" type="image/png" sizes="32x32" href="../favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="../favicon-16x16.png">
<link rel="stylesheet" type="text/css" href="../layout/corporate-design.css">
<link rel="stylesheet" type="text/css" href="../layout/signature.css">
<link rel="stylesheet" type="text/css" href="../layout/primitives.css">
<link rel="stylesheet" type="text/css" href="../layout/layout-center.css">
<style type="text/css">
svg {
	width: 233px;
	height: 333px;
	border-radius: 7px;
	border: 5px solid #000;
	margin: 2px;
}
#results {
	position: absolute;
	left: 0;
	margin-top: 40px;
	padding: 10px 0;
	width: 100%;
	background: #fff;
}
</style>
<script type="text/javascript" src='../script/dom/expander.js'></script>
<script data-main="../script/guides/card-generator.js" src="../external/require.js"></script>
</head>
<body>
<?php echo file_get_contents('../layout/signature.xml');?>
<h4 id="instructions-header" class="expander">Data Formatting (click to show/hide)</h4>
<ul id="instructions" class="expandable">
<li>Data must be comma-separated</li>
<li>The first row of data is parsed as column headers</li>
<li>The following columns are interpreted by the tool:
<ul>
	<li>Card Name,Types,Attack Type,Damage Type,Damage,Range,Move Points,Trigger,Trigger Effect,Trigger 2,Trigger Effect 2,Text,Flavor Text,Trigger Text,Trigger Text 2,Quality,Rarity,Set,Item,ImageUrl</li>
</ul></li>
<li>If any of the mentioned columns isn't present the tool will still generate a card. Hence, delete what you'll not need.</li>
<li>The data may also include additional columns.</li>
<li>If you copy data directly from the test server, <b>REMOVE THE FIRST LINE</b>.</li>
<li>Data from test server is available <a href="http://test.cardhunter.com/data/gameplay/Cards/Cards.csv">here</a></li>
</ul>
<div id="input">
<textarea id="taInput" placeholder="paste card data here">Card Name,Types,Attack Type,Damage Type,Damage,Range,Move Points,Trigger,Trigger Effect,Trigger 2,Trigger Effect 2,Text,Flavor Text,Trigger Text,Trigger Text 2,Quality,Rarity,Set
</textarea>
<!--<label><input id='thumbnail' type="checkbox"/>as thumbnails</label>-->
<button id="bProcess">Generate Images</button>
</div>
<button id="bBack" style="display:none">Back to Data-Input</button>
<div id="results"> </div>
</body>
</html>