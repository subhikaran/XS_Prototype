
const vscode = require('vscode');
const { DebugPanel } = require('./DebugPanel');
const { TestPanel } = require('./TestPanel');
var fs = require('fs');
var isXSProject = false;

const wsPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
const ext = '.sln';
var files = fs.readdirSync(wsPath);
const slnFiles = files.filter(file => {
	return file.endsWith(ext);
});

if (slnFiles !== []) {
	console.log('sln file found: ' + slnFiles[0]);
	var slnPath = wsPath + "\\" + slnFiles[0];
	const slnData = fs.readFileSync(slnPath, { encoding: 'utf8', flag: 'r' });

	if (slnData !== '') {
		var lines = slnData.toString().split('\n');
		for (var line = 0; line < lines.length; line++) {
			var currentline = lines[line].split('=');
			if (currentline[0].trim() === 'XSProject') {
				isXSProject = currentline[1].trim();
				break;
			}
		}
	}


}
else {
	console.log('sln files not found');
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	if (isXSProject) {
		var tfePath = wsPath + "\\TFE.json";
		var tfeData = JSON.parse(fs.readFileSync(tfePath, { encoding: 'utf8', flag: 'r' }));
	}

	context.subscriptions.push(vscode.commands.registerCommand('customextension.debugPanel', function () {
		DebugPanel.createOrShow(context.extensionUri);
		setTimeout(function () {
			DebugPanel.loadData(tfeData);
		}, 1000)
	}));

	context.subscriptions.push(vscode.commands.registerCommand('customextension.testPanel', function () {
		TestPanel.createOrShow(context.extensionUri);
	}));
}

function deactivate() { }

vscode.commands.executeCommand("workbench.action.closeAllEditors");

module.exports = {
	activate,
	deactivate
}
