import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { GitExtension } from "../types/git";
import { exec, execSync } from "child_process";
import Branch from "./BranchTreeItem";

export class MainTreeViewProvider implements vscode.TreeDataProvider<Branch> {

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
