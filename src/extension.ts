import * as vscode from 'vscode';
import { MainTreeViewProvider } from './treeviews/MainTreeViewProvider';
import { BranchTreeViewProvider } from './treeviews/BranchTreeViewProvider';
import BranchTreeItem from "./treeviews/BranchTreeItem";
import GitService from "./services/GitService";

export function activate(context: vscode.ExtensionContext) {

	const mainTreeViewProvider = new MainTreeViewProvider();
	vscode.window.registerTreeDataProvider("gitflow.views.main", mainTreeViewProvider);

	const featureTreeViewProvider = new BranchTreeViewProvider("feature");
	vscode.window.registerTreeDataProvider("gitflow.views.feature", featureTreeViewProvider);

	const releaseTreeViewProvider = new BranchTreeViewProvider("release");
	vscode.window.registerTreeDataProvider("gitflow.views.release", releaseTreeViewProvider);

	vscode.commands.registerCommand("gitflow.init", () => {
		console.log("Init");
	});

	vscode.commands.registerCommand("gitflow.refresh", () => { 
		mainTreeViewProvider.refresh();
		featureTreeViewProvider.refresh();
		releaseTreeViewProvider.refresh();
	});
	vscode.commands.registerCommand("gitflow.checkout", ( item ) => {
		if( item instanceof BranchTreeItem ) {
			if ( item.isRemote ) {
				GitService.flowTrack( item.prefix, item.branchName );
			} else {
				GitService.checkout( item.branch );
			}

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

	vscode.commands.registerCommand("gitflow.release.start", () => {
		vscode.window.showInputBox({
			placeHolder: "Enter a name to create release branch"
		}).then( ( branch ) => {
			if( branch ) {
				GitService.flowStart("release", branch );
				vscode.commands.executeCommand("gitflow.refresh");
			}
		});
	});

	vscode.commands.registerCommand("gitflow.finish", ( item ) => {
		if( item instanceof BranchTreeItem && item.prefix === "feature" ) {
			GitService.flowFinish( item.prefix, item.branchName );
			vscode.commands.executeCommand("gitflow.refresh");
		}
	});

	vscode.commands.registerCommand("gitflow.branch.delete", ( item ) => {
		if( item instanceof BranchTreeItem ) {
			GitService.delete( item.branch, item.isRemote );
			return vscode.commands.executeCommand("gitflow.refresh");
		}
	});

	vscode.commands.registerCommand("gitflow.views.feature.filterRemotes", () => {
		const configuration = vscode.workspace.getConfiguration("gitflow");
		const showRemoteBranches = configuration.get<boolean>("views.feature.showRemoteBranches", true );

		configuration.update("views.feature.showRemoteBranches", !showRemoteBranches, vscode.ConfigurationTarget.Global )
			.then( () => {
				vscode.commands.executeCommand("gitflow.refresh");
			});
	});

	vscode.commands.registerCommand("gitflow.publish", ( item ) => {
		if( item instanceof BranchTreeItem && item.isRemote === false ) {
			GitService.flowPublish( item.prefix, item.branchName );
		}
	});
	
	vscode.commands.executeCommand("setContext", "gitflow.initialized", GitService.isInitialized );
}

// this method is called when your extension is deactivated
export function deactivate() {}
