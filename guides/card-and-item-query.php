<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="author" content="PhoenixTheHunter">
<meta name="description" content="Provides a query functionality for all cards and items - especially for Aloyzo's Arsenal">
<meta name="keywords" content="Blue Manchu, Card Hunter, util, utils, utility, utilities, PhoenixTheHunter, AA, Aloyzo's Arsenal, query">
<title>Card and Item Query, Card Hunter Utilities, by PhoenixTheHunter</title>
<link rel="icon" type="image/png" sizes="32x32" href="../favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="../favicon-16x16.png">
<link rel="stylesheet" type="text/css" href="../layout/corporate-design.css">
<link rel="stylesheet" type="text/css" href="../layout/signature.css">
<link rel="stylesheet" type="text/css" href="../layout/primitives.css">
<link rel="stylesheet" type="text/css" href="../layout/layout-center.css">
<link rel="stylesheet" type="text/css" href="../layout/selection-table.css">
<script type="text/javascript" src='../script/dom/expander.js'></script>
<script data-main="../script/guides/card-and-item-query.js" src="../external/require.js"></script>
</head>
<body>
<?php echo file_get_contents('../layout/signature.xml');?>
<h4 id="instructions-header" class="expander">Instructions (click to show/hide)</h4>
<ul id="instructions" class="expandable">
<li>This tool offers a facility to query both cards and items.</li>
<li>This is especially useful to find appropriate cards for your Aloyzo's Arsenal submission.</li>
<li>Use the custom filter style originally created for the collection analysis to describe the expected items or cards.</li>
<li>You may freely format the filter rule with line-breaks and tabs. They are ignored.</li>
<li>Based on the selected option the filter is either applied to all cards or items and all matching cards/items are displayed.</li>
<li>Use the 'quantity'-operator (<code>&lt; ... &gt;</code>) to switch from cards to items and vice versa.
<ul>
	<li>Use the operator on card level to query all items with this card.</li>
	<li>Use the operator on item level to query all cards on this item.</li>
</ul></li>
<li>Use the quantity-operator with an empty body for simple counting.
<ul>
	<li>E.g. <code>&lt;4&gt;()</code> on card level will match a card if it is printed on exactly 4 different items.</li>
</ul></li>
<li>Specify information of the queried cards or items that should be shown in addition to the name separated by commas in the input field.</li>
</ul>
<textarea id="query" placeholder="Write query here"><?php if(isset($_GET["query"])) echo htmlspecialchars($_GET["query"]);?></textarea>
<div class="options">
<table class='selection'><tr>
	<td><label><input type="radio" id="baseCard" name="base" <?php if(!isset($_GET["item"])) echo "checked"?>>Query Cards</label></td>
	<td><label><input type="radio" id="baseItem" name="base" <?php if(isset($_GET["item"])) echo "checked"?>>Query Items</label></td>
</tr></table>
Information to retrieve: <input id='cols' type='text' placeholder="enter comma-separated fields here" value="<?php if(isset($_GET["ret"])) echo htmlspecialchars($_GET["ret"]);?>" />
</div>
<button id="bProcess">Execute Query</button>&nbsp;&nbsp;&nbsp;<a href='./custom-filter.php' target='_blank'>Cheat Sheet</a>
<div id="results"></div>
<div id='cardData' class='data'><?php include_once("../fetch-resource.php"); echo fetchAndEscapeCards();?></div>
<div id='equipmentData' class='data'><?php include_once("../fetch-resource.php"); echo fetchResource("Equipment");?></div>
</body>
</html>
