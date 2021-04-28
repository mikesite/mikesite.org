<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<meta name="author" content="PhoenixTheHunter">
		<meta name="description" content="A collection of community-created utility tools in the ecosystem of the D'n'D-themed game Card Hunter by Blue Manchu">
		<meta name="keywords" content="Blue Manchu, Card Hunter, util, utils, utility, utilities, PhoenixTheHunter">
		<title>Card Hunter Utilities, by PhoenixTheHunter</title>
		<link rel="icon" type="image/png" sizes="32x32" href="./favicon-32x32.png">
		<link rel="icon" type="image/png" sizes="16x16" href="./favicon-16x16.png">
		<link rel="stylesheet" type="text/css" href="./layout/corporate-design.css">
		<link rel="stylesheet" type="text/css" href="./layout/signature.css">
		<link rel="stylesheet" type="text/css" href="./layout/layout-center.css">
		<style type="text/css">
			h3 {
				margin: 3px;
			}
			br + h3 {
				margin-top: 1em;
			}
			h4 {
				font-style: italic;
				margin: 5px 12px 2px;
			}
		</style>
	</head>
	<body>
		<?php echo str_replace("..", ".", file_get_contents('./layout/signature.xml'));?>
		<h3>Badges</h3>
		<a href="./badges/campaign-badge.php">Campaign Badge</a><br>
		<a href="./badges/collection-badge.php">Collection Badge</a><br>
		<h3>Utilities</h3>
		<a href="./utils/collection-analysis.php">Collection Analysis</a><a style="display:none;" href="./utils/analysis-details.php"></a><br>
		<a href="./utils/collection-excess.php">Collection Excess</a><br>
		<a href="./utils/shop-excess.php">Shop Excess</a><br>
		<h4>Legacy Tools</h4>
		<a href="./utils/collection-export.php">Collection Export</a><br>
		<a href="./utils/equipment-xref.php">Equipment Table Cross-Reference</a><br>
		<a href="./utils/mining-log.php">Mining Log</a><br>
		<h3>Guides and Challenges</h3>
		<a href="./guides/quick-draw-card-pool.php">Quick Draw Card Pool</a><br>
		<a href="./guides/custom-filter.php">Cheat Sheet for the Custom Filter</a><br>
		<h4>Aloyzo's Arsenal</h4>
		<a href="./guides/card-and-item-query.php">Card and Item Query</a><br>
		<a href="./guides/card-generator.php">Card Generator</a><br>
		<h4>Cuthbert's Costumes</h4>
		<a href="./guides/figure-color-schemes.php">Color Schemes of CH Figures</a><br>
	</body>
</html>
