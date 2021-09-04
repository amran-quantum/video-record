var express = require('express');
var path = require('path');
var serveStatic = require('serve-static');
var app = express();
var port = process.env.PORT || 8080
app.listen(port);
console.log('starting project at ' + port);
//Look for statics first
app.use(serveStatic(path.join(__dirname)));
