import * as vscode from "vscode";

export default class Branch extends vscode.TreeItem {
    
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
