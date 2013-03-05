// <! --

var req = new XMLHttpRequest();
req.open("GET","cals.json",true);
req.onreadystatechange = function() {
	 if (this.readyState == 4) {
		  var doc = eval('(' + this.responseText + ')');
		  for (var o in doc.timeunit) {
				document.write("$"+doc.timeunit[o].name+"$");
				document.write("$"+doc.timeunit[o].imgheight+"$");
				document.write("$"+doc.timeunit[o].imgspan+"$");
				document.write("$"+doc.timeunit[o].epoch+"$");
		  }
	 }
}
req.send(null);

// -->
