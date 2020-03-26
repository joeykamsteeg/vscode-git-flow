import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export class BranchTreeViewProvider implements vscode.TreeDataProvider<Branch> {

    private _onDidChangeTreeData: vscode.EventEmitter<Branch | undefined> = new vscode.EventEmitter<Branch | undefined>();

    public readonly onDidChangeTreeData?: vscode.Event<Branch | null | undefined> | undefined;

    getTreeItem(element: Branch): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }
    getChildren(element?: Branch | undefined): vscode.ProviderResult<Branch[]> {
        return Promise.resolve([ new Branch("1", "1.0.0", vscode.TreeItemCollapsibleState.Collapsed )]);
    }

    public refresh(): void {
        this._onDidChangeTreeData.fire();
        console.log("Refresh");
    }
}

class Branch extends vscode.TreeItem {

    constructor( 
        public readonly label: string,
        private version: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super( label, collapsibleState );
    }

    public get tooltip(): string {
        // TODO: Return Full Branch Name
        return "";
    }

    public get description(): string {
        return "";
    }

    iconPath = {
        light: path.join(__filename, "..", "..", "resources", "light", "code-branch-light.svg"),
        dark: path.join(__filename, "..", "..", "resources", "dark", "code-branch-light.svg"),
    };
}
