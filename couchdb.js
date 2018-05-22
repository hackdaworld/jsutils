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
 * couchdb.js - couchdb interface
 *
 * author: frank@hackdaworld.org
 *
 */

var couchdb = {
	type: "http",
	host: "cdbsrv",
	prefix: "",
	headers: null,
	init: function(type,host,port,prefix) {
		if(type!==undefined)
			couchdb.type=type;
		if(host!==undefined)
			couchdb.host=host;
		if(port!==undefined) {
			couchdb.port=port;
		}
		else {
			couchdb.port=80;
			if(type==="https")
				couchdb.port=443;
		}
		if(prefix!==undefined)
			couchdb.prefix=prefix;
	},
	set_headers: function(hdrs) {
		couchdb.headers=hdrs;
	},
	cdb_xhr: function(type,url,data,cb) {
		var ao={
			url: url,
			type: type,
			success: function(ret) {
				var ro=ret;
				if(typeof ret === "string") {
					cl("couchdb: xhr return string parsed");
					ro=JSON.parse(ret);
				}
				if('error' in ro) {
					switch(ro.error) {
						case "file_exists":
							cl("couchdb: exists - "+
							   url);
							break;
						case "not_found":
							cl("couchdb: not found"+
							   " - "+url);
							break;
						default:
							cl("couchdb: error - "+
							   url);
							cl(ret);
					}
				}
				else {
					cl("couchdb: xhr success - "+url);
				}
				if(cb!==undefined)
					cb(ro);
			},
			error: function(xhr,stat,err) {
				cl("couchdb conn: "+url+", error: "+err+
				   ", stat: "+stat);
				cl("executing callback anyways ...");
				cb();
			}
		};
		if((data!==undefined)&&(data!==null)) {
			if(typeof data != "string") {
				cl("couchdb: xhr data stringified");
				ao.data=JSON.stringify(data);
			}
			else {
				ao.data=data;
			}
		}
		// headers
		if(couchdb.headers!==null) {
			ao.headers=couchdb.headers;
			/*
			cl(couchdb.headers);
			ao.beforeSend=function(req) {
				for(var k in couchdb.headers) {
					var hval=couchdb.headers[k];
					cl("couchdb: adding header "+k+": "
					   +hval);
					req.setRequestHeader(k,hval);
				}
			}
			*/
		}
		$.ajax(ao);
	},
	item_count: function(db,callback) {
		var url=couchdb.type+"://"+couchdb.host+":"+couchdb.port+"/"+
		        couchdb.prefix+db+"/_all_docs?limit=0";
		couchdb.cdb_xhr('GET',url,null,function(ret) {
			callback(ret.total_rows);
		});
	},
	get_raw: function(db,raw,callback) {
		var url=couchdb.type+"://"+couchdb.host+":"+couchdb.port+"/"+
		        couchdb.prefix+db+raw;
		couchdb.cdb_xhr('GET',url,null,function(ret) {
			callback(ret);
		});
	},
	get_view_key: function(db,view,viewdetail,key,callback) {
		var raw="/_design/"+view+"/_view/"+viewdetail+'?key="'+key+'"';
		couchdb.get_raw(db,raw,callback);
	},
	get_item: function(db,key,callback) {
		var url=couchdb.type+"://"+couchdb.host+":"+couchdb.port+"/"+
		        couchdb.prefix+db+"/"+key;
		couchdb.cdb_xhr('GET',url,null,function(ret) {
			callback(ret);
		});
	},
	get_db: function(db,callback) {
		var url=couchdb.type+"://"+couchdb.host+":"+couchdb.port+"/"+
		        couchdb.prefix+db+"/_all_docs?include_docs=true";
		couchdb.cdb_xhr('GET',url,null,function(ret) {
			callback(ret);
		});
	},
	add_item: function(db,key,data,callback) {
		var url=couchdb.type+"://"+couchdb.host+":"+couchdb.port+"/"+
		        couchdb.prefix+db+"/"+key;
		couchdb.cdb_xhr('PUT',url,data,function(ret) {
			callback(ret);
		});
	},
	get_uuid_server: function(callback) {
		var url=couchdb.type+"://"+couchdb.host+":"+couchdb.port+"/"+
		        "_uuids";
		couchdb.cdb_xhr('GET',url,null,function(ret) {
			callback(ret.uuids[0]);
		});

	},
	get_uuid_soft: function(callback) {
		function s4() {
			var help=Math.floor((1 + Math.random()) * 0x10000);
			return help.toString(16).substring(1);
		}
		callback(s4()+s4()+s4()+s4()+s4()+s4()+s4()+s4());
	},
	add_item_random_uuid: function(db,data,callback) {
		couchdb.get_uuid_soft(function(uuid) {
			couchdb.add_item(db,uuid,data,function(ret) {
				cl("couchdb: created doc with random uuid: "+
				   uuid);
				callback(ret);
			});
		});
	},
	update_item: function(db,key,data,callback) {
		couchdb.get_item(db,key,function(ret) {
			var mod=false;
			for(var k in data) {
				if((ret[k]===undefined)||
				   (ret[k]!=data[k])) {
					cl("couchdb update, "+k+": "+ret[k]+
					   " -> "+data[k]);
					ret[k]=data[k];
					mod=true;
				}
			}
			if(mod) {
				var url=couchdb.type+"://"+couchdb.host+":"+
				        couchdb.port+"/"+couchdb.prefix+
				        db+"/"+key;
				couchdb.cdb_xhr('PUT',url,ret,function(r) {
					callback(r);
				});
			}
		});
	}
};
