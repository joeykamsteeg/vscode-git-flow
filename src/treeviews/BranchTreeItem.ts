import * as vscode from "vscode";
import { GitFlowPrefix } from "../services/GitService";

export default class Branch extends vscode.TreeItem {
    
    private _branch: string;
    private _prefix: GitFlowPrefix;

    constructor( 
        branch: string,
        public readonly active: boolean,
        prefix: GitFlowPrefix = "",
        public readonly isRemote: boolean = false
    ) {
        super( branch, vscode.TreeItemCollapsibleState.None );

        this._branch = branch;
        this._prefix = prefix;

        this.label = this.isRemote ? this._branch.replace(`remotes/origin/${this._prefix}/`, "") : this._branch.replace(`${this._prefix}/`, "");
    }

    public get branch(): string {
        return this._branch;
    }

    public get branchName(): string {
        return this.label || "";
    }

    public get prefix(): GitFlowPrefix {
        return this._prefix;
    }

    public get tooltip(): string {
        return this._branch;
    }

    public get description(): string {
        return this.active === true ? "active" : "";
    }

    iconPath = new vscode.ThemeIcon( this.isRemote === true ? "git-branch" : this.active === true ? "circle-filled" : "circle-outline");
}
