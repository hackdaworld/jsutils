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
 * xhr.js - xml http request function
 *
 * author: frank@hackdaworld.org
 *
 */

function xhr(type,url,data,cb,cberr) {
	var ao={
		url: url,
		type: type,
		success: function(ret) {
			cb(ret);
		}
	};
	if(cberr!==undefined) {
		ao.error=function(xhr,stat,err) {
			cberr(xhr,stat,err);
		};
	};
	if((data!==undefined)&&(data!==null)) {
		if(typeof data != "string")
			ao.data=JSON.stringify(data);
		else
			ao.data=data;
	}
	$.ajax(ao);
}

