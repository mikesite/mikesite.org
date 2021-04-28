<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="author" content="PhoenixTheHunter">
<meta name="description" content="Overview of all color schemes of playable figures from Card Hunter">
<meta name="keywords" content="Blue Manchu, Card Hunter, util, utils, utility, utilities, PhoenixTheHunter, Figures Spread">
<title>Color Schemes of CH Figures, Card Hunter Utilities, by PhoenixTheHunter</title>
<link rel="icon" type="image/png" sizes="32x32" href="../favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="../favicon-16x16.png">
<link rel="stylesheet" type="text/css" href="../layout/corporate-design.css">
<link rel="stylesheet" type="text/css" href="../layout/signature.css">
<link rel="stylesheet" type="text/css" href="../layout/primitives.css">
<link rel="stylesheet" type="text/css" href="../layout/layout-wide.css">
<style type="text/css">
body.primaryColor img.colorB, body.primaryColor img.colorC {
	display: none;
}
</style>
<script data-main="../script/guides/figure-color-schemes.js" src="../external/require.js"></script>
</head>
<body class="primaryColor">
<?php echo file_get_contents('../layout/signature.xml');?>
<div id='figuresData' class='data'><?php include_once("../fetch-resource.php"); echo fetchResource("Figures");?></div>
</body>
</html>
