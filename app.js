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

for(var m in manifest){
    app.get(m+"/*", function(req, res){
	res.redirect(manifest[m]);
    });
}

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
