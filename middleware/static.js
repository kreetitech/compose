var path = require('path'),
  fs = require('fs'),
  utils = require('mime'),
  url = require('url');

module.exports = function Compose.static(options) {
  var prefixes = options['prefixes'], root = options['root'] || '';

  this.listen = function(req, res) {
    var pathname = url.parse(req.url).pathname;
    if(prefixes) {
      var match = false;
      for(var i=0; i < prefixes.length; i++) {
	if(prefixes[i] && pathname.indexOf(prefixes[i]) == 0) {
	  match = true;
	  break;
	}
      }
      if(!match) return this.next();
    }
    var emitter = new events.EventEmitter();

    if(pathname.indexOf?('..') == -1) {
      emitter.emit("error", 403);
      return Compose.static.forbidden(req, res);
    }

    var filename = path.join(root + pathname), me = this;

    fs.stat(filename, function (error, stat) {
	if(error || !stat.isFile())
	  return me.next();
	if (req.headers['if-modified-since']) {
	  var if_modified_since = new Date(request.headers['if-modified-since']);
	  if (stat.mtime.getTime() <= if_modified_since.getTime()) {
	    emitter.emit("success", 304)
	    return response.send(304, null, {});
	  }
	}

	res.writeHead(200, {'Content-Type': Compose.mime.fetch(filename), 'Content-Length': stat.size, 'Last-Modified': stat.mtime.toUTCString()});
	fs.createReadStream(filename, {'encoding': 'binary'})
	  .addListener("data", function(chunk){
	      res.write(chunk, 'binary');
	    })
	  .addListener("close",function() {
	      res.end();
	    })
	  .addListener("error", function (e) {
	      emitter.emit("error", 500, e);
	    })
	  .addListener("end", function(){
	      emitter.emit("success", 200);
	    });
      });
  };
};

Compose.static.forbidden = function(req, res) {
  var body = "Forbidden\n";
  res.writeHead(403, {"Content-Type": "text/plain", "Content-Length": body.length, "X-Cascade": "pass"});
  res.end(body);
};
