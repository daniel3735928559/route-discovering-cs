var express = require('express');
var http = require('http');
var fs = require('fs')

var args = process.argv.slice(2);
var app = express();

var manifest_path = args[1];
var manifest = {};

try{
    var buf = fs.readFileSync(manifest_path, "ASCII");
    manifest = JSON.parse(buf.toString());
}
catch(e){
    console.log("Cannot find file: "+manifest_path);
    return -1;

}

console.log(manifest);

app.get("/", function(req, res){
    res.redirect(manifest["/"]);
})

app.get("/:branch", function(req, res){
    var loc = req.params.branch;
    if(manifest[loc])
	res.redirect(manifest[loc]);
    else
	res.redirect(manifest["/"]+"/"+loc)
})

app.get("/:branch/*", function(req, res){
    var loc = req.params.branch;
    if(manifest[loc])
	res.redirect(manifest[loc]+"/" + req.params[0]);
    else
	res.redirect(manifest["/"]+"/"+loc+"/" + req.params[0])
})

function proxy_req(client_req,client_res,loc,path){
    if(!(manifest[loc])){
	client_res.send("Error");
    }
    
    var options = {
	"hostname": "discovering.cs.wisc.edu",
	"port": manifest[loc],
	"path": path,
	"method": 'GET'
    };

    console.log(options);
    var proxy = http.request(options, function (res) {
	res.pipe(client_res, {
	    end: true
	});
    });

    client_req.pipe(proxy, {
	end: true
    });

    proxy.end()
}

// for(var m in manifest){
//     function f(loc){
// 	console.log("loc",loc);
//     }
//     f(m);
// }

server = http.createServer(app).listen(parseInt(args[0]));
console.log("Server running...");

// if(args.length > 0){
//     server.on('connection', function (sock) {
// 	if(sock.remoteAddress != args[0]){
// 	console.log("Denied: " + sock.remoteAddress);
// 	    sock.end("Access denied");
// 	}
//     });
//     console.log("Server running on:" + args[0]);
// }
// else{
//     console.log("Server running!");
// }
