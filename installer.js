var electronInstaller = require('electron-winstaller');
var path = require('path');

function buildFor (arch) {

    console.log("Building ", arch);

    const options = {
        appDirectory: path.join(__dirname, 'build', 'xpd_admin-win32-' + arch),
        outputDirectory: path.join(__dirname, 'bin', 'xpd_admin-win32-' + arch),
        title: 'XPD Admin',
        description: 'System Setup and Admin Control',
        authors: 'RZX Tecnologia',
        setupExe: 'xpd_admin.exe',
        iconUrl: path.join(__dirname, 'dist', 'favicon.ico'),
        setupIcon: path.join(__dirname, 'dist', 'favicon.ico'),
    };

    // console.log(options);

    var resultPromise = electronInstaller.createWindowsInstaller(options);
    
    resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));

}

buildFor('x64');
// buildFor('ia32');