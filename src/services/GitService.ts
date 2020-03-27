import * as vscode from "vscode";
import { execSync, exec } from "child_process";

export declare type GitFlowPrefix = "feature" | "hotfix" | "release" | "support";

interface IGitFlowConfig {
    branches: {
        master: string;
        develop: string;
    },
    prefixes: {

    }
}

class GitService {

    private _cwd: string;

    constructor( cwd: string ) {
        this._cwd = cwd;
    }

    private exec( command: string ) : string {
        const output = execSync( command, {
            cwd: this._cwd
        });

        if( output ) {
            return output.toString().trim();
        }

        return "";
    }

    private getConfig( key: string ): string {
        return this.exec(`git config ${key}`);
    }

    public get flowConfig(): IGitFlowConfig {
        return {
            "branches": {
                "master": this.getConfig("gitflow.branch.master"),
                "develop": this.getConfig("gitflow.branch.develop")
            },
            "prefixes": {
                "feature": this.getConfig("gitflow.prefix.feature"),
                "release": this.getConfig("gitflow.prefix.release"),
                "hotfix": this.getConfig("gitflow.prefix.hotfix"),
                "support": this.getConfig("gitflow.prefix.support"),
                "versiontag": this.getConfig("gitflow.prefix.versiontag")
            }
        };
    }

    public get branches(): string[] {
        const output = this.exec("git branch");
        const rawBranches = output.split(`\n`);

        return rawBranches.map( ( branch ) => {
            branch = branch.replace(/[*]/gm, "");
            branch = branch.trim();

            return branch;
        });
    }

    public get activeBranch(): string {
        return this.exec("git branch | sed -n '/\* /s///p'");
    }

    public checkout( branch: string ): string {
        return this.exec(`git checkout ${branch}`);
    }

    public flowStart( prefix: GitFlowPrefix, branch: string ) {
        return this.exec(`git flow ${prefix} start ${branch}`);
    }

    public delete( branch: string ) {
        return this.exec(`git branch -d ${branch}`);
    }
}

const service = new GitService( vscode.workspace.rootPath || "" );
export default service;
