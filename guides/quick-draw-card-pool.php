<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="author" content="PhoenixTheHunter">
<meta name="description" content="Overview of the available cards in the multiplayer-league-mode 'Quick Draw'">
<meta name="keywords" content="Blue Manchu, Card Hunter, util, utils, utility, utilities, PhoenixTheHunter, QD, Quick Draw, Card Pool">
<title>Quick Draw Card Pool, Card Hunter Utilities, by PhoenixTheHunter</title>
<link rel="icon" type="image/png" sizes="32x32" href="../favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="../favicon-16x16.png">
<link rel="stylesheet" type="text/css" href="../layout/corporate-design.css">
<link rel="stylesheet" type="text/css" href="../layout/signature.css">
<link rel="stylesheet" type="text/css" href="../layout/primitives.css">
<link rel="stylesheet" type="text/css" href="../layout/layout-center.css">
<link rel="stylesheet" type="text/css" href="../layout/option-table.css">
<link rel="stylesheet" type="text/css" href="../layout/card-types.css">
<script type="text/javascript" src='../script/dom/expander.js'></script>
<script data-main="../script/guides/quick-draw-card-pool.js" src="../external/require.js"></script>
</head>
<body>
<?php echo file_get_contents('../layout/signature.xml');?>
<h4 id="instructions-header" class="expander">Instructions (click to show/hide)</h4>
<ol id="instructions" class="expandable">
<li>Select the class and race of a quick draw character.</li>
<li>The race may be either set to a concrete race, to no race or any race.</li>
<li>Click "Show Card Pool".</li>
<li>See the available cards of the selected character by card quality.</li>
<li>The cards are sorted by and associated with a probability that this card is available in the offered card selection.</li>
</ol>
<div class="options">
<table class='option'>
<tr><td>Class:</td><td>
		<select id="classOption" title="Select the character's class">
			<option>Warrior</option>
			<option>Wizard</option>
			<option>Priest</option>
		</select>
	</td></tr>
<tr><td>Race:</td><td>
		<select id="raceOption" title="Select the character's race">
			<option>no race</option>
			<option>Dwarf</option>
			<option>Human</option>
			<option>Elf</option>
			<option>any race</option>
		</select>
	</td></tr>
</table>
</div>
<button id="bProcess">Show Card Pool</button>
<div id="results"></div>
<div id='cardData' class='data'><?php include_once("../fetch-resource.php"); echo fetchAndEscapeCards();?></div>
<div id='equipmentData' class='data'><?php include_once("../fetch-resource.php"); echo fetchResource("Equipment");?></div>
</body>
</html>
