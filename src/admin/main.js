var electron = require('electron');
var path = require('path');
var url = require('url');

var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var mainWindow;

function getUserHome() {
	return process.env.HOME || process.env.USERPROFILE;
}

app.on('window-all-closed', function() {
	if (process.platform != 'darwin')
		app.quit();
});

// var clientCrt = path.join('/', '.xpd', 'keys', 'os', 'XPD-Client.crt');
var clientCrt = path.join(__dirname, 'keys', 'XPD-Client.crt');

app.commandLine.appendSwitch('client-certificate', clientCrt);
app.commandLine.appendSwitch('ignore-certificate-errors');

app.on('certificate-error', function(event, webContents, url, error, certificate, callback) {
	console.log(url);
  	event.preventDefault();
  	callback(true);
});

app.on('ready', function() {

	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: false
		},
		icon: path.join(__dirname, 'assets', 'icon', 'logo.png')
	});

	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'pages', 'admin.html'),
		protocol: 'file:',
		slashes: true
	}));

	// mainWindow.webContents.openDevTools();
});
