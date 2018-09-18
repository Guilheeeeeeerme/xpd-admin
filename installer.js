var electronInstaller = require('electron-winstaller');
var path = require('path');

function buildFor (arch) {

    console.log("Building ", arch);

    var resultPromise = electronInstaller.createWindowsInstaller({
        appDirectory: path.join(__dirname, 'build', 'Admin-win32-' + arch + ''),
        outputDirectory: path.join(__dirname, 'bin', 'Admin-win32-' + arch + ''),
        title: 'XPD Admin',
        description: 'System Setup and Admin Control',
        authors: 'RZX Tecnologia',
        setupExe: 'Admin-win32-' + arch + '.exe',
        iconUrl: path.join(__dirname, 'dist', 'logo.ico'),
        setupIcon: path.join(__dirname, 'dist', 'logo.ico'),
    });
    
    resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));

}

buildFor('x64');
// buildFor('ia32');