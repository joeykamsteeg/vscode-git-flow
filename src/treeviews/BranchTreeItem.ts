import * as vscode from "vscode";
import { GitFlowPrefix } from "../services/GitService";

export default class Branch extends vscode.TreeItem {
    
    private _branch: string;
    private _prefix: GitFlowPrefix;

    constructor( 
        branch: string,
        public readonly active: boolean,
        prefix: GitFlowPrefix = ""
    ) {
        super( branch, vscode.TreeItemCollapsibleState.None );

        this._branch = branch;
        this._prefix = prefix;

        this.label = this._branch.replace(`${this._prefix}/`, "");
    }

    public get branch(): string {
        return this._branch;
    }

    public get prefix(): string {
        return this._prefix;
    }

    public get tooltip(): string {
        return this._branch;
    }

    public get description(): string {
        return this.active === true ? "active" : "";
    }

    iconPath = new vscode.ThemeIcon( this.active === true ? "circle-filled" : "circle-outline");
}
