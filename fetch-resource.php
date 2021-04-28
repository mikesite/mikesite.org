<?php
function fetchResource($name) {
  if (file_exists("../resource/$name.csv")) {
    return file_get_contents("../resource/$name.csv");
  } else {
    return file_get_contents("http://live.cardhunter.com/data/gameplay/$name/$name.csv");
  }
}

function fetchAndEscapeCards() {
  $raw = fetchResource("Cards");
  return str_replace(">","&gt;",str_replace("<","&lt;",str_replace("&","&amp;",str_replace("\xA0","",$raw))));
}
?>
