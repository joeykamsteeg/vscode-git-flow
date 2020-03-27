import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { exec, execSync } from "child_process";
import GitService, { GitFlowPrefix } from "../services/GitService";
import Branch from "./BranchTreeItem";

export class BranchTreeViewProvider implements vscode.TreeDataProvider<Branch> {

    private _onDidChangeTreeData: vscode.EventEmitter<Branch | undefined> = new vscode.EventEmitter<Branch | undefined>();
    private _prefix: GitFlowPrefix;

    readonly onDidChangeTreeData: vscode.Event<Branch | undefined> = this._onDidChangeTreeData.event;

    constructor( prefix: GitFlowPrefix ) {
        this._prefix = prefix;
    }
    
    getTreeItem(element: Branch): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }
    getChildren(element?: Branch | undefined): vscode.ProviderResult<Branch[]> {
        const activeBranch = GitService.activeBranch;
        const branches = GitService.branches.filter( ( branch ) => {
            const filter = vscode.workspace.getConfiguration("gitflow").get("views.feature.showRemoteBranches" );
            if( filter === true ) {
                return ( branch.startsWith( `${this._prefix}/` ) || branch.startsWith(`remotes/origin/${this._prefix}/`) );
            }

            return branch.startsWith( `${this._prefix}/` );
        });

        return Promise.resolve( branches.map( ( branch ) => { 
            const isRemote = branch.startsWith(`remotes/origin/${this._prefix}/`);

            return new Branch( branch, branch === activeBranch, this._prefix, isRemote );
        }));
    }

    public refresh(): void {
        this._onDidChangeTreeData.fire();
    }
}
