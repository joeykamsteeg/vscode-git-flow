# Changelog
All notable changes to this project will be documented in this file.

<!-- ## [Unreleased] -->

### v0.4.2
### Fixed
- Feature branch list did not display correct branches with a differect `git config gitflow.prefix.feature` setting. (#2, special thanks to @darkpio)

### v0.4.1
### Added
- Log the git commands output to Output

### v0.4.0
### Added
- Option to pull a branch
- Output Error Logs

### v0.3.1
### Fixed
- Don't show error message when get a git config value
- Merge the develop branch before the branch get merged into the feature branch

### v0.3.0
### Added
- Option to merge develop branch into feature

### v0.2.2
### Added
- Display error when git command execution has failed

## v0.3.0
### Added
- Option to merge develop branch into feature

## v0.2.2
### Fixed
- Windows: Fetch correct active branch

## v0.2.1
### Fixed
- Fixed issue finished feature branch not merging into develop
- Delete remote branches

## v0.2.0
### Added
- Display remote branches in the feature list
- Setting to show / hide remote branches in feature list
- Checkout remote features to local

## v0.1.1
### Fixed
- Removed finish action on master and develop branch menu

## v0.1.0
### Added
- Initial release of vscode-git-flow
- Visualized the master and develop branch and able to checkout
- Visualized the features branch and able to checkout, finish and delete