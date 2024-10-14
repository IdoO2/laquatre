# CONTRIBUTING

## Git

Updates should be made in a dedicated branch and merged with a merge commit (--no-ff).

Do your best to have

- Branches with a specific scope
- Commits with a specific update (unitary commits)

## Code quality

No pre-commit verification has been added yet, so be very careful to lint and typecheck your code before merging. See `package.json` scripts for the relevant commands.

All business logic must be unit tested before merging. Further tests, of course, preferably exist too.

# Work in progress

Code that needs more work should be clearly indicated with a `// TODO ...` comment, which explains why an update is needed (a link to documentation and a ticket is welcome). Needless to say, they must not lie there forever.
