<?php

ini_set('display_errors','On');
putenv('GDFONTPATH=' . realpath('/www/off/fonts/'));

function get_safe_simp($string,$defaultval = '') {
  return ((isset($_GET[$string])) ? $_GET[$string] : ((isset($defaultval)) ? $defaultval : ''));
}
$jsons = json_decode(file_get_contents('cals.json'),true);
$imgid = get_safe_simp('id',0);
$str = get_safe_simp('str','hms');

foreach($jsons["timeunit"] as $TU) {
  if ($TU["name"] == $str) {
  	 $thistu = $TU;
  }
}
$imgheight = $thistu["imgheight"];
$imgspan = $thistu["imgspan"];
$epoch = $thistu['epoch'];
$font = $thistu['font'];
list($red, $green, $blue) = $thistu['color'];
$vals_in_img = $thistu['vals_in_img'];
$datef = $thistu['dateformat'];
$im = imagecreate(65,$imgheight);
$white = imagecolorallocate($im,255,255,255);
//$white = imagecolorallocate($im,255,255,rand(0,255));
$color = imagecolorallocate($im,$red,$green,$blue);
$tzi = $thistu['timezone'];
date_default_timezone_set($tzi);

if (get_safe_simp('testing','no') == 'no') {
  for ( $i = 0 ; $i < $vals_in_img ; $i++  ) {
	 $me = imagettftext($im,8,0,0,($i*$imgheight/$vals_in_img)+8,
							  $color,$font,date($datef,$epoch + ($imgspan * ($imgid + ($i/$vals_in_img)))));
  }
  header("Content-type: image/png");
  imagepng($im);
  imagedestroy($im);
 } else {
  echo $thistu['timezone'];
 }

?>
