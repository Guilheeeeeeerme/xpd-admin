let electron = require('electron');
let path = require('path');
let url = require('url');

let app = electron.app;
let BrowserWindow = electron.BrowserWindow;
let mainWindow;

function getUserHome() {
	return process.env.HOME || process.env.USERPROFILE;
}

app.on('window-all-closed', function() {
	if (process.platform != 'darwin') {
		app.quit();
	}
});

let MAX_GIGABYTES = 4;
let MAX_MEGABYTES = MAX_GIGABYTES * 1024;

// var clientCrt = path.join('/', '.xpd', 'keys', 'os', 'XPD-Client.crt');
let clientCrt = path.join(__dirname, 'keys', 'XPD-Client.crt');

app.commandLine.appendSwitch('client-certificate', clientCrt);
app.commandLine.appendSwitch('ignore-certificate-errors');
app.commandLine.appendSwitch('js-flags', '--max_old_space_size=' + MAX_MEGABYTES);

app.on('certificate-error', function(event, webContents, url, error, certificate, callback) {
	console.log(url);
 event.preventDefault();
 callback(true);
});

app.on('ready', function() {

	mainWindow = new BrowserWindow({
		show: false,
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: false,
		},
		icon: path.join(__dirname, 'assets', 'icon', 'logo.png'),
	});

	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'pages', 'admin.html'),
		protocol: 'file:',
		slashes: true,
	}));

	mainWindow.maximize();
	mainWindow.show();

	// mainWindow.webContents.openDevTools();
});
