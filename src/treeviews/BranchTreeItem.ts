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

        this.label = ( this.isRemote ? this._branch.replace(`remotes/origin/${this._prefix}/`, "") : this._branch.replace(`${this._prefix}/`, "") );
        this.tooltip = `${this._branch} (${ this.isRemote === true ? "remote" : "local"})`;
        this.description = this.active === true ? "active" : "";
    }

    public get branch(): string {
        return this._branch;
    }

    public get branchName(): string | vscode.TreeItemLabel {
        return this.label || "";
    }

    public get prefix(): GitFlowPrefix {
        return this._prefix;
    }

    iconPath = new vscode.ThemeIcon( this.isRemote === true ? "git-branch" : this.active === true ? "circle-filled" : "circle-outline");
}
