// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { MainTreeViewProvider } from './treeviews/MainTreeViewProvider';
import { BranchTreeViewProvider } from './treeviews/BranchTreeViewProvider';
import GitService from "./services/GitService";

export function activate(context: vscode.ExtensionContext) {

	const mainTreeViewProvider = new MainTreeViewProvider();
	vscode.window.registerTreeDataProvider("gitflow.views.main", mainTreeViewProvider);

	const featureTreeViewProvider = new BranchTreeViewProvider("feature");
	vscode.window.registerTreeDataProvider("gitflow.views.feature", featureTreeViewProvider);

	vscode.commands.registerCommand("gitflow.refresh", () => { 
		mainTreeViewProvider.refresh();
		featureTreeViewProvider.refresh();
	});
	vscode.commands.registerCommand("gitflow.checkout", ( branchItem ) => {
		if( branchItem.active === false ) {
			GitService.checkout( branchItem.label );
			return vscode.commands.executeCommand("gitflow.refresh");
		}
	});
	vscode.commands.registerCommand("gitflow.start.feature", () => {
		vscode.window.showInputBox({
			placeHolder: "Enter Feature Name",
		}).then( ( branch ) => {
			if( branch ) {
				GitService.flowStart("feature", branch );
				vscode.commands.executeCommand("gitflow.refresh");
			}
		});
	});
}

// this method is called when your extension is deactivated
export function deactivate() {}
