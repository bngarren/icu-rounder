## Release

1. Create release branch off of develop
   > git checkout -b release/x.x.x develop
2. Bump version in `package.json` according to semvar
3. Update `CHANGELOG.md` with this release's notes. Can use `md-link.sh` to help generate markdown style links from commit hash
4. Once happy with the release branch, push to remote
5. Create pull request on Github, release/x.x.x --> master
6. Review the pull request for consistency. Make sure issues that the PR resolves have been mentioned using a keyword in the commit or by directly linking the issue to the PR in Github.
7. Merge the pull request to master and create a Tag for this release called "vX.x.x"
8. Pull the remote master branch back down local
9. Merge back with develop (in case any changes where made associated with the PR review)
