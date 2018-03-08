var electronInstaller = require('electron-winstaller');
var path = require('path');

var dist = path.join('/', '.xpd', 'dist');

var releases = [{
	appDirectory: path.join(dist, 'Driller-win32-x64'),
	outputDirectory: path.join(__dirname, 'installer', 'Driller-win32-x64'),
	title : 'XPD Driller',
	authors: 'RZX Team.',
	description: 'real time driller screen',
	setupExe: 'Driller-win32-x64.exe',
	iconUrl: path.join(__dirname, 'dist','driller','assets','icon','logo.ico'),
	setupIcon: path.join(__dirname, 'dist','driller','assets','icon','logo.ico')
},{
	appDirectory: path.join(dist, 'Admin-win32-ia32'),
	outputDirectory: path.join(__dirname, 'installer', 'Admin-win32-ia32'),
	title : 'XPD Admin',
	authors: 'RZX Team.',
	description: 'system setup and admin control',
	setupExe: 'Admin-win32-ia32.exe',
	iconUrl: path.join(__dirname, 'dist','admin','assets','icon','logo.ico'),
	setupIcon: path.join(__dirname, 'dist','admin','assets','icon','logo.ico')
},{
	appDirectory: path.join(dist, 'Admin-win32-x64'),
	outputDirectory: path.join(__dirname, 'installer', 'Admin-win32-x64'),
	title : 'XPD Admin',
	authors: 'RZX Team.',
	description: 'system setup and admin control',
	setupExe: 'Admin-win32-x64.exe',
	iconUrl: path.join(__dirname, 'dist','admin','assets','icon','logo.ico'),
	setupIcon: path.join(__dirname, 'dist','admin','assets','icon','logo.ico')
},{
	appDirectory: path.join(dist, 'Driller-win32-ia32'),
	outputDirectory: path.join(__dirname, 'installer', 'Driller-win32-ia32'),
	title : 'XPD Driller',
	authors: 'RZX Team.',
	description: 'real time driller screen',
	setupExe: 'Driller-win32-ia32.exe',
	iconUrl: path.join(__dirname, 'dist','driller','assets','icon','logo.ico'),
	setupIcon: path.join(__dirname, 'dist','driller','assets','icon','logo.ico')
}];

createWindowsInstaller();

function createWindowsInstaller(){
	if(releases && releases.length > 0){
		var release = releases.pop();
		console.log('Packing %s', release.setupExe);
		electronInstaller.createWindowsInstaller( release ).then(success, failure);
	}
}

function success(){
	console.log('It worked!');
	createWindowsInstaller();
}

function failure(e) {
	console.log('No dice: '+ e.message); 
	createWindowsInstaller();
}