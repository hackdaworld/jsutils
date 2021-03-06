/*
 *  This file is part of jsutils.
 *
 *  jsutils is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  jsutils is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with jsutils.  If not, see <http://www.gnu.org/licenses/>.
 *
 *  Copyright (c) 2018 hackdaworld.org
 */

/*
 *
 * utils.js - small helper functions
 *
 * author: frank@hackdaworld.org
 *
 */

function cl(str) {
	console.log(str);
}

function objdbg(obj) {
	var msg="debug object:\n";
	for(var k in obj) {
		msg=msg+"--> "+k+": "+obj[k]+"\n";
	}
	cl(msg);
}

function anddbg(obj) {
	var msg="debug object:\n";
	for(var k in obj) {
		msg=msg+"--> "+k+": "+obj[k]+"\n";
	}
	alert(msg);
}

function newdbg(obj) {
	var msg=JSON.stringify(obj,null,2);
	alert(msg);
}

function objsize(obj) {
	var size=0;
	for(var key in obj) {
		if(obj.hasOwnProperty(key)) size++;
	}
	return size;
}

function contains(obj,val) {
	for(var key in obj) {
		if(obj.hasOwnProperty(key))
			if(obj[key]===val)
				return true;
	}
	return false;
}

function clone(obj) {
	var cln={};
	for(var key in obj) {
		if(obj.hasOwnProperty(key)) cln[key]=obj[key];
	}
	return cln;
}

function zeropad(num,size) {
	var ret=num.toString();
	while(ret.length<size) {
		ret="0"+ret;
	}
	return ret;
}

function spad(str,size) {
	var ret=str;
	while(ret.length<size) {
		ret=" "+ret;
	} 
	return ret;
}

function spt(str,size) {
	if(str.length<size) {
		var ret=str;
	}
	else {
		var ret=str.substring(0,size);
	}
	while(ret.length<size) {
		ret=ret+" ";
	} 
	return ret;
}

function html2ascii(str) {
	ret=str.replace(/\&Auml\;/g,"Ä");
	ret=ret.replace(/\&Ouml\;/g,"Ö");
	ret=ret.replace(/\&Uuml\;/g,"Ü");
	ret=str.replace(/\&auml\;/g,"ä");
	ret=ret.replace(/\&ouml\;/g,"ö");
	ret=ret.replace(/\&uuml\;/g,"ü");
	ret=ret.replace(/\&szlig\;/g,"ß");
	ret=ret.replace(/\&amp\;/g,"&");
	return ret;
}

function ascii2html(str) {
	ret=ret.replace(/&/g,"&amp;");
	ret=str.replace(/Ä/g,"&Auml;");
	ret=ret.replace(/Ö/g,"&Ouml;");
	ret=ret.replace(/Ü/g,"&Uuml;");
	ret=str.replace(/ä/g,"&auml;");
	ret=ret.replace(/ö/g,"&ouml;");
	ret=ret.replace(/ü/g,"&uuml;");
	ret=ret.replace(/ß/g,"&szlig;");
	return ret;
}

function is_in_list(element,list) {
	for(var l in list) {
		if(element==list[l]) return true;
	}
	return false;
}

function remove_sel_from_html_string(str,sel) {
	var wrapped=$("<div>"+str+"</div>");
	var obj=sel;
	if(typeof sel == 'string')
		obj=[sel];
	for(var sid in obj) {
		wrapped.find(obj[sid]).remove();
	}
	return wrapped.html();
}

function disable_sel_from_html_string(str,sel) {
	var wrapped=$("<div>"+str+"</div>");
	var obj=sel;
	if(typeof sel == 'string')
		obj=[sel];
	for(var sid in obj) {
		wrapped.find(obj[sid]).attr("disabled","true")
			.css("background-color","#555");
	}
	return wrapped.html();
}

function str_to_ms(str) {
	var units = {
		ms: 1,
		milli: 1,
		millis: 1,
		millisecond: 1,
		milliseconds: 1,
		s: 1000,
		second: 1000,
		seconds: 1000,
		m: 60*1000,
		min: 60*1000,
		mins: 60*1000,
		minute: 60*1000,
		minutes: 60*1000,
		h: 60*60*1000,
		hr: 60*60*1000,
		hrs: 60*60*1000,
		hour: 60*60*1000,
		hours: 60*60*1000,
		d: 60*60*24*1000,
		day: 60*60*24*1000,
		days: 60*60*24*1000,
		w: 60*60*24*1000*7,
		week: 60*60*24*1000*7,
		weeks: 60*60*24*1000*7
	};
	var millis = 0;
	str.replace(/(\d+(?:\.\d*)?)\s*([a-z]+)?/ig,function($0,number,unit) {
		if(unit) {
			number*=units[unit.toLowerCase()] || 1;
		}
		millis += +number;
	});
	return millis;
};

