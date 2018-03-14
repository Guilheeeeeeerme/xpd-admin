var express = require('express');
var fs = require('fs');
var https = require('https');
var path = require('path');
var PORT = 4300;

var app = express();

// opções de autenticação
var key = fs.readFileSync(path.join(__dirname, 'keys', 'XPD-Server.key'));
var cert = fs.readFileSync(path.join(__dirname, 'keys', 'XPD-Server.crt'));
var ca = fs.readFileSync(path.join(__dirname, 'keys', 'RZX-CA.crt'));

var options = {
	key,
	cert,
	ca,
	requestCert: true,
	rejectUnauthorized: false,
};

var server = https.createServer(options, app);

app.use(function (req, res, next) {
	// CORS
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

	if (req.client.authorized) {
		next();
	} else {
		res.writeHead(401);
		res.end('denied\n');
	}

});

app.use('/node_modules', express.static('node_modules'))
app.use('/', express.static('src'))

server.listen(PORT, '0.0.0.0', onServerReady);

function onServerReady() {
	console.log('Server started at: https://%s:%s', '127.0.0.1', PORT);
}
