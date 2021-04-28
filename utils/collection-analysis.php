<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="author" content="PhoenixTheHunter">
<meta name="description" content="Analyzer for collection completeness from Card Hunter">
<meta name="keywords" content="Blue Manchu, Card Hunter, util, utils, utility, utilities, PhoenixTheHunter, Collection Analysis">
<title>Collection Analysis, Card Hunter Utilities, by PhoenixTheHunter</title>
<link rel="icon" type="image/png" sizes="32x32" href="../favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="../favicon-16x16.png">
<link rel="stylesheet" type="text/css" href="../layout/corporate-design.css">
<link rel="stylesheet" type="text/css" href="../layout/signature.css">
<link rel="stylesheet" type="text/css" href="../layout/primitives.css">
<link rel="stylesheet" type="text/css" href="../layout/layout-center.css">
<link rel="stylesheet" type="text/css" href="../layout/option-table.css">
<link rel="stylesheet" type="text/css" href="../layout/selection-table.css">
<link rel="stylesheet" type="text/css" href="../layout/analysis-table.css">
<style type="text/css">
#hover-box {
	position: fixed;
	display: block;
	top: 35%;
	left: 75%;
	margin: -100px 0 0 0;
	width: 255px;
	padding: 15px;
	background-color: #eee;
	border: 2px solid #999;
}
</style>
<script type="text/javascript" src='../script/dom/expander.js'></script>
<script data-main="../script/utils/collection-analysis.js" src="../external/require.js"></script>
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
<table class='option'>
<tr><td>Treasures:</td><td>
		<select id="includeTreasure" title="Select if you want to see treasures in the result">
			<option>no treasures</option>
			<option>include treasures</option>
			<option>only treasures</option>
		</select>
	</td></tr>
<tr><td>Promo Items:</td><td>
		<select id="includePromo" title="Select if you want to see promotion items (seasonal reprints) in the result">
			<option>no promo items</option>
			<option>include promo items</option>
			<option>only promo items</option>
		</select>
	</td></tr>
<tr><td>Undroppable Items:</td><td>
		<select id="includeNoLoot" title="Select if you want to see items that may not drop from chests">
			<option>no undroppable items</option>
			<option>include undroppable items</option>
			<option>only undroppable items</option>
		</select>
	</td></tr>
</table>
<br>
<table class="option">
<tr><td>count:</td><td>
		<select id='slotMax' title="Select up to which count the analysis should check">
			<option>one copy of each item</option>
			<option>equip one character</option>
			<option>equip a balanced team</option>
			<option>equip a whole team</option>
			<option>can equip one character?</option>
			<option>can equip a balanced team?</option>
			<option>can equip a whole team?</option>
		</select>
	</td></tr>
<tr><td>list:</td><td>
		<select id='hoverBoxSelection' title="Select which items the hover box should list">
			<option>missing items</option>
			<option>collected items</option>
			<option>all items</option>
			<option>excessing items</option>
		</select>
	</td></tr>
<tr><td>sort:</td><td>
		<select id='hoverBoxSort' title="Select in which order the items in the hover box should be shown">
			<option>$$$ -> $</option>
			<option>$ -> $$$</option>
			<option>Legendary -> Common</option>
			<option>Common -> Legendary</option>
			<option>A -> Z</option>
			<option>Z -> A</option>
			<option>Lvl 99 -> Lvl 1</option>
			<option>Lvl 1 -> Lvl 99</option>
			<option>Token(s) -> none</option>
			<option>none -> Token(s)</option>
			<option>99x Item -> 1x Item</option>
			<option>1x Item -> 99x Item</option>
		</select>
	</td></tr>
</table>
<br/>
<div>
	Custom item filter:&nbsp;&nbsp;&nbsp;
	<a href='../guides/custom-filter.php' target='_blank'>Cheat Sheet</a>&nbsp;&nbsp;&nbsp;
	<a id='filter_perma' href="#">Filter-Permalink</a>
	<input id='customPredicate' type='text'
		oninput="document.getElementById('filter_perma').href='collection-analysis.php?query='+encodeURIComponent(this.value)"
		value='<?php if(isset($_GET["query"])) echo htmlspecialchars($_GET["query"]);?>' title="Specify the type of items you want to analyze"/>
</div>
</div>
<button id="bProcess">Process Data</button>
<button id="bReport" disabled>Export Report</button>
<button id="bItems" disabled>Export Items</button>
<br><br>
<div id="results"></div>
<div id="hover-box" style="display:none"></div>
<div id='slotMaxVariants' style='display:none;'>
Id,Arcane Item,Arcane Skill,Boots,Divine Armor,Divine Item,Divine Skill,Divine Weapon,Dwarf Skill,Elf Skill,Heavy Armor,Helmet,Human Skill,Martial Skill,Robes,Shield,Staff,Treasure,Weapon
1,4,1,1,1,3,1,2,1,1,1,1,1,1,1,1,2,1,3
2,4,1,3,1,3,1,2,1,1,1,1,1,1,1,2,2,1,3
3,12,3,3,3,9,3,6,3,3,3,3,3,3,3,3,6,1,9
</div>
<div id='cardData' class='data'><?php include_once("../fetch-resource.php"); echo fetchAndEscapeCards();?></div>
<div id='equipmentData' class='data'><?php include_once("../fetch-resource.php"); echo fetchResource("Equipment");?></div>
</body>
</html>
