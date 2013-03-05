<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<title>nownow</title>
<meta name="no-email-collection" content="http://www.unspam.com/noemailcollection" />
<meta name="robots" content="NOINDEX,NOARCHIVE,FOLLOW,NOIMAGEINDEX,NOIMAGECLICK" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Pragma-directive" content="no-cache" />
<meta http-equiv="cache-directive" content="no-cache" />
<link href="maybe.css" rel="stylesheet" type="text/css">
<script type="text/javascript" src="pre.js"></script>
<script type="text/javascript" src="logic.js"></script>
</head>
<body>
<div id="invis-json-tzs" class="invis"><span><?php
	
ini_set('display_errors','On'); 
//	 echo shell_exec('find /usr/share/zoneinfo/posix -type f | colrm 1 26');
$tzs = timezone_identifiers_list();
foreach ($tzs as $i => $tz) {
  $tzs[$i] = array($tz,timezone_offset_get(timezone_open($tz),new DateTime()));
}
function cmp($a,$b) {
  return ($a[1] == $b[1]) ? 0 : (($a[1] < $b[1]) ? -1 : 1 );
}
usort($tzs,'cmp');
echo '{"zone" : ['."\n";
foreach ($tzs as $index => $tz) {
  echo '{"n":"'.$tz[0].'","o":"'.$tz[1].'"},';
  if ($index > 213) break;
}
echo '{}]}';
?></span></div>
<div id="invis-json-cals" class="invis"><span><?php

	 echo file_get_contents('cals.json');

?></span></div>
</body>
</html>
