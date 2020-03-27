import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { GitExtension } from "../types/git";
import { exec, execSync } from "child_process";
import GitService from "../services/GitService";
import Branch from "./BranchTreeItem";

declare type GitFlowPrefix = "feature" | "hotfix" | "release" | "support";

export class BranchTreeViewProvider implements vscode.TreeDataProvider<Branch> {

    private _onDidChangeTreeData: vscode.EventEmitter<Branch | undefined> = new vscode.EventEmitter<Branch | undefined>();
    private _prefix: GitFlowPrefix;

    public readonly onDidChangeTreeData?: vscode.Event<Branch | null | undefined> | undefined;

    constructor( prefix: GitFlowPrefix ) {
        this._prefix = prefix;
    }
    
    getTreeItem(element: Branch): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }
    getChildren(element?: Branch | undefined): vscode.ProviderResult<Branch[]> {
        const activeBranch = GitService.activeBranch;
        const branches = GitService.branches.filter( ( branch ) => ( branch.startsWith( `${this._prefix}/` ) ) );

        return Promise.resolve( branches.map( ( branch ) => new Branch( branch, branch === activeBranch ) ) );
    }

    public refresh(): void {
        this._onDidChangeTreeData.fire();
    }
}
