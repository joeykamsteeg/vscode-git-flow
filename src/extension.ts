// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { MainTreeViewProvider } from './treeviews/MainTreeViewProvider';
import { BranchTreeViewProvider } from './treeviews/BranchTreeViewProvider';
import BranchTreeItem from "./treeviews/BranchTreeItem";
import GitService from "./services/GitService";
import Branch from './treeviews/BranchTreeItem';

export function activate(context: vscode.ExtensionContext) {

	const mainTreeViewProvider = new MainTreeViewProvider();
	vscode.window.registerTreeDataProvider("gitflow.views.main", mainTreeViewProvider);

	const featureTreeViewProvider = new BranchTreeViewProvider("feature");
	vscode.window.registerTreeDataProvider("gitflow.views.feature", featureTreeViewProvider);

	vscode.commands.registerCommand("gitflow.init", () => {
		const { master, develop } = GitService.flowConfig.branches;
		const { feature, hotfix, release, support, versiontag } = GitService.flowConfig.prefixes;

		if( master && develop && feature && hotfix && release && support ) {
			const configuration = vscode.workspace.getConfiguration("gitflow");
			configuration.update("initialized", true );
		} else {
			const configuration = vscode.workspace.getConfiguration("gitflow");
			configuration.update("initialized", false );
		}
	});

	vscode.commands.registerCommand("gitflow.refresh", () => { 
		mainTreeViewProvider.refresh();
		featureTreeViewProvider.refresh();
	});
	vscode.commands.registerCommand("gitflow.checkout", ( item ) => {
		if( item instanceof BranchTreeItem ) {
			GitService.checkout( item.branch );
			return vscode.commands.executeCommand("gitflow.refresh");
		}
	});
	vscode.commands.registerCommand("gitflow.feature.start", () => {
		vscode.window.showInputBox({
			placeHolder: "Enter a name to create feature branch"
		}).then( ( branch ) => {
			if( branch ) {
				GitService.flowStart("feature", branch );
				vscode.commands.executeCommand("gitflow.refresh");
			}
		});
	});

	vscode.commands.registerCommand("gitflow.branch.delete", ( item ) => {
		if( item instanceof BranchTreeItem ) {
			GitService.delete( item.branch );
			return vscode.commands.executeCommand("gitflow.refresh");
		}
	});

	vscode.commands.executeCommand("gitflow.init");
}

// this method is called when your extension is deactivated
export function deactivate() {}
