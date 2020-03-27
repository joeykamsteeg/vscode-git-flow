import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { GitExtension } from "../types/git";
import { exec, execSync } from "child_process";

export class BranchTreeViewProvider implements vscode.TreeDataProvider<Branch> {

    private _onDidChangeTreeData: vscode.EventEmitter<Branch | undefined> = new vscode.EventEmitter<Branch | undefined>();

    public readonly onDidChangeTreeData?: vscode.Event<Branch | null | undefined> | undefined;

    getTreeItem(element: Branch): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }
    getChildren(element?: Branch | undefined): vscode.ProviderResult<Branch[]> {
        const master: string = execSync("git config gitflow.branch.master",{
            cwd: vscode.workspace.rootPath
        }).toString().trim();

        const develop: string = execSync("git config gitflow.branch.develop",{
            cwd: vscode.workspace.rootPath
        }).toString().trim();
        
        const currentBranch = execSync("git branch | sed -n '/\* /s///p'", {
            cwd: vscode.workspace.rootPath
        }).toString().trim();

        const masterBranch = new Branch( master, currentBranch === master );
        const developBranch = new Branch( develop, currentBranch === develop );

        return Promise.resolve([ masterBranch, developBranch ]);
    }

    public refresh(): void {
        console.log("Refresh");
        this._onDidChangeTreeData.fire();
        this.getChildren();
    }
}

class Branch extends vscode.TreeItem {
    
    constructor( 
        label: string,
        public readonly active: boolean
    ) {
        super( label, vscode.TreeItemCollapsibleState.None );
    }

    public get tooltip(): string {
        return "";
    }

    public get description(): string {
        return this.active === true ? "active" : "";
    }

    iconPath = new vscode.ThemeIcon( this.active === true ? "circle-filled" : "circle-outline");
}
