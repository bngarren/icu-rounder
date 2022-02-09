## Release

1. Create release branch off of develop
   > git checkout -b release/x.x.x develop
2. Bump version in `package.json` according to semvar
3. Update `CHANGELOG.md` with this release's notes. Can use `md-link.sh` to help generate markdown style links from commit hash
4. Once happy with the release branch, merge back with develop.
   > git checkout develop
5. Consider using the "--no-commit" flag to review staged changes prior to commit
   > git merge --no-ff release/x.x.x
6. Push the develop branch to remote (origin)
7. Create pull request on Github, develop --> master
