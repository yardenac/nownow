// <! --
ie = (navigator.appName == 'Microsoft Internet Explorer');
Object.add_span = function(str) {
	 var o = document.createElement('SPAN');
	 o.appendChild(document.createTextNode(str));
	 o.rewrite = function(s) {
		  o.removeChild(o.firstChild);
		  o.appendChild(document.createTextNode(s));
	 }
	 this.appendChild(o);
	 return o;
}
function opacify(obj,opacity) {
	 obj.style.opacity = opacity * 0.01;
	 obj.style.filter = "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + opacity + ")";
	 obj.style.filter = "alpha(opacity=" + opacity + ")";
}
function divtxt_from_id(divid_str) {
	 return document.getElementById(divid_str).firstChild.firstChild.nodeValue;
}
av_erage = 0;
av_count = 0;
function update_average(newval) {
	 return (av_erage += (newval/(--av_count)));
}
/* CORE FUNCTIONALITY */
function redraw_rovers() {
	 var begin = new Date().getTime();
	 try {
		  for (var i = 0 ; i < rover_queue.length ; i++) {
//				log('.');
				rover_queue[i].balign_images();
				if ((((new Date().getTime())-begin)) > 41) {
//					 log('k');
					 break;
//				} else log((((new Date().getTime())-begin)));
				} //else log('.');
		  }
	 } catch (err) {}
	 var end = new Date().getTime();
//	 log(update_average(end-begin).toFixed(2));
//	 log((end-begin).toFixed(2));
	 GLOBAL_I--;
}
GLOBAL_I = 0;
rovt = null;
function redraw_request(immediacy) {
//	 log('.');
//	 return false;
	 if (immediacy == true) {
		  setTimeout(redraw_rovers,0);
		  return false;
	 }
	 var i = GLOBAL_I++;
	 if (i == 0) {
		  setTimeout(redraw_rovers,41);
	 } else if (i == 1) {
		  setTimeout(redraw_rovers,200);
	 } else {
		  GLOBAL_I--;
	 }
	 return false;
}
displaced_secs = 0;
keep_on_ticking = true;
function update_globals(new_nownow,immediacy) {
//	 log('!');
//	 return false;
	 nownownow = Math.round((new Date().getTime()) / 1000);
	 if ((new_nownow == null) || isNaN(new_nownow)) {
		  if (keep_on_ticking) nownow = nownownow + displaced_secs;
		  else displaced_secs = nownow - nownownow;
	 } else {
		  nownow = new_nownow;
		  displaced_secs = nownow - nownownow;
	 }
	 if (Math.abs(displaced_secs) < 1) displaced_secs = 0;
	 if (typeof(cb_now) != 'undefined') {
		  cb_now.setyn(displaced_secs == 0);
	 }
	 redraw_request(false,immediacy);
}
tick_milliseconds = 1000;
function once_a_sec() {
	 var millis_in = new Date().getMilliseconds();
	 if (millis_in < 40) {
		  tick_milliseconds = 1000;
	 } else if (millis_in > 500) {
		  tick_milliseconds = 1100;
	 } else {
		  tick_milliseconds = 960;
	 }
	 update_globals();
}
function log(str) {
	 try {
		  outwin.add_span(str + ' ');
	 } catch (e) {}
}
function make_li_checkbox(text,funcbody) {
	 var o = document.createElement('LI');
	 o.className = 'statbrick';
	 o.add_span = Object.add_span;
	 o.txt = o.add_span(text);
	 o.cb = document.createElement('INPUT');
	 o.cb.type = "checkbox";
	 o.cb.checked = true;
	 o.cb.after_click = new Function('ischecked',funcbody);
	 o.cb.onclick = function() {
		  this.after_click(this.checked);
		  return true;
	 }
	 o.setyn = function(yn) {
		  this.cb.checked = yn;
		  this.cb.onclick();
	 }
	 o.appendChild(o.cb);
	 o.txt.onclick = function() { o.cb.click(); }
	 return o;
}
/* MAKE-ME FUNCTIONS - SIMPLE */
function make_statbox() {
	 var o = document.createElement('DIV');
	 o.className="statbox";
	 o.appendChild(o.ul = document.createElement('UL'));
	 o.ul.className='statlist';
	 o.ul.appendChild(cb_tick = make_li_checkbox('Tick?','\
		keep_on_ticking = ischecked;\
		if (!ischecked) cb_now.setyn(false);\
	 '));
	 o.ul.appendChild(cb_now = make_li_checkbox('Now?','\
		if (ischecked) {\
			displaced_secs = 0;\
			cb_tick.setyn(true);\
		}\
	 '));
	 return o;
}
function make_output_window() {
	 var d = document.createElement('DIV');
	 d.className = "orbit";
	 d.add_span = Object.add_span;
	 d.appendChild(make_statbox());
	 document.body.appendChild(d);
	 return d;
}
function make_ether() {
	 var o = document.createElement('DIV');
	 o.className = "gambit";
	 document.body.appendChild(o);
	 return o;
}
function make_rover_queue() {
	 var local_queue_array = new Array();
	 local_queue_array.add_new_rover = function(obj) {
		  this[this.length] = obj;
		  return true;
	 }
	 return local_queue_array;
}
/* MAKE-ME FUNCTIONS - VDRAGGABLES */
function make_vdraggable_div(onmovefuncname,getcurvalfuncbody,scale) {
	 var o = document.createElement('DIV');
	 o.DRAG = false;
	 o.YDOWN = o.WAS = o.STO = null;
	 o.scale = scale;
	 o.onmovefunc = onmovefuncname;
	 o.getcurval = new Function(getcurvalfuncbody);
	 o.onmousedown = function(e) {
		  if (!this.DRAG) {
				this.DRAG = true;
				this.WAS = this.getcurval();
				if (!ie) event = e;
				this.YDOWN = event.clientY;
		  }
		  return false;
	 }
	 o.onmouseup = function(e) {
		  this.DRAG = false;
		  return false;
	 }
	 o.onmousemove = function(e) {
		  if (!ie) event = e;
		  if (this.DRAG) {
				var diff = this.YDOWN - event.clientY;
				var newv = this.WAS + (diff * this.scale);
				clearTimeout(this.STO);
				this.STO = setTimeout(this.onmovefunc + '(' + newv + ')',1);
		  }
		  return false;
	 }
	 o.onmouseout = function(e) {
		  if (this.DRAG) {
				this.DRAG = false;
		  }
 		  return false;
	 }
	 return o;
}
function make_guidebar_slider() {
	 var o = make_vdraggable_div("guidebar.reoffset",'return guidebar.offs;',-1);
	 o.className = "guidebar_slider";
	 ether.appendChild(o);
	 return o;
}
function make_rover(imgheight,imgspan,epoch,str,saystr) {
	 var o = make_vdraggable_div('update_globals','return nownow;',(imgspan/imgheight));
	 o.className = "rover";
	 ether.appendChild(o);
	 o.str = str;
	 o.epoch = epoch;
	 o.imgspan = imgspan;
	 o.imgheight = imgheight;
	 o.imgs = new Array();
	 o.height = function() { return this.offsetHeight; } // - 2
	 o.needed = Math.ceil(o.height()/o.imgheight) + 2;

	 o.coverpane = document.createElement('DIV');
	 o.coverpane.style.height=o.height()+"px";
	 o.coverpane.className='cpane';
	 o.appendChild(o.coverpane);

	 o.awning = document.createElement('DIV');
	 o.awning.className='awning';
	 o.awning.add_span = Object.add_span;
	 o.awning.add_span(saystr);
	 o.appendChild(o.awning);

	 o.footing = document.createElement('SELECT');
	 o.footing.className='tzselect';
	 o.footing.name='tz';
	 o.footing.size = 1;
	 var opts = eval('(' + divtxt_from_id('invis-json-tzs') + ')');
	 for (var i in opts.zone) {
		  var j = opts.zone[i];
		  o.footing.add(new Option(j.n,j.o),null);
	 }
	 o.footing.selectedIndex = Math.floor(Math.random()*i);
	 o.appendChild(o.footing);

	 o.balign_images = function() {
		  var begin = new Date().getTime();
//		  log('!');
		  var a = ((nownow - this.epoch)/this.scale)-guidebar.offs;
		  var this_id = Math.floor(a/this.imgheight);
		  var this_top = ((this.imgheight * this_id) - a) - 5;
		  needloop: for (var i = 0 ; i < this.needed ; i++ , this_top += this.imgheight, this_id++ ) {
				if ((((new Date().getTime())-begin)) > 20) {
//					 rovt = setTimeout(redraw_rovers,41);
					 if (this.DRAG) return false;
				}
				for (var j = i ; j < this.imgs.length ; j++) { // if already have it
					 if (this.imgs[j]._id == this_id) {
						  for (var k = j ; k > i ; k--) { // move to front
//								log('c');
								var hold = this.imgs[k-1];
								this.imgs[k-1] = this.imgs[k];
								this.imgs[k] = hold;
						  }
						  this.imgs[i].style.top = this_top + 'px';
						  continue needloop;
					 }
				}
				if (this.imgs.length < this.needed) { //need more
//					 log('^');
					 for (var j = this.imgs.length ; j > i ; j--) {
//						  log('+');
						  this.imgs[j] = this.imgs[j-1];
					 }
					 this.imgs[i] = document.createElement('IMG');
					 this.imgs[i].className = 'pimg';
					 this.imgs[i].reassign = function(p_id,p_top) {
						  this._id = p_id;
						  this.style.top = p_top + 'px';
						  this.src = 'img.php?str=' + this.parentNode.str + '&id=' + p_id;
					 }
					 this.insertBefore(this.imgs[i],this.coverpane);
					 this.imgs[i].reassign(this_id,this_top);
					 continue needloop;
				}
//				log('~');
				var hold = this.imgs[this.imgs.length - 1];
				this.imgs[this.imgs.length - 1] = this.imgs[i];
/*				for (var j = this.imgs.length ; j > i ; j--) {
					 log('<' + j);
					 this.imgs[j-1] = this.imgs[j-2];
				}*/
				this.imgs[i] = hold;
				this.imgs[i].reassign(this_id,this_top);
		  }
		  this.imgs.length = this.needed;
//		  clearTimeout(rovt);
	 }
	 o.on_resize = function(new_height) {
		  this.coverpane.style.height=this.height()+"px";
		  this.needed = Math.ceil(this.height()/this.imgheight) + 2;
		  this.balign_images();
	 }
	 rover_queue.add_new_rover(o);
	 return o;
}
function make_guidebar(starting_offset) {
	 var g = document.createElement('DIV');
	 g.className = 'guidebar';
	 opacify(g,60);
	 g.reoffset = function(num) {
		  if (!num) num = this.offs;
		  else this.offs = num;
		  this.style.bottom = (rover_queue[0].offsetHeight - num - 4) + 'px';
		  redraw_request();
	 }
	 g.reoffset(starting_offset);
	 ether.appendChild(g);
	 return g;
}

update_globals();

/* THINGS START HERE */
function beguine() {
	 outwin = make_output_window();
	 ether = make_ether();
	 rover_queue = make_rover_queue();
	 guidebar_slider = make_guidebar_slider();
	 doc = eval('(' + divtxt_from_id('invis-json-cals') + ')');
	 for (var o in doc.timeunit) {
		  var p = doc.timeunit[o];
		  if (p.show == 'yes') {
				make_rover(p.imgheight,p.imgspan,p.epoch,p.name,p.sayname);
		  }
	 }
	 guidebar = make_guidebar(100);
	 window.onresize = function() {
		  guidebar.reoffset();
		  for (var i = 0 ; i < rover_queue.length ; i++) {
				rover_queue[i].on_resize();
		  }
	 }
	 update_globals(null,true);
};
recursive_tick = function() {
	 once_a_sec();
	 rrrr = setTimeout('recursive_tick();',tick_milliseconds);
};
window.onload = function() {
	var t = setTimeout('beguine()',0);
	var u = setTimeout('recursive_tick();',41);
}
// -->
