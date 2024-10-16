# CONTRIBUTING

## Git

Updates should be made in a dedicated branch and merged with a merge commit (--no-ff).

Do your best to have

- Branches with a specific scope
- Commits with a specific update (unitary commits)

## Code quality

No pre-commit verification has been added yet, so be very careful to lint and typecheck your code before merging. See `package.json` scripts for the relevant commands.

All business logic must be unit tested before merging. Further tests, of course, preferably exist too.

## Work in progress

Code that needs more work should be clearly indicated with a `// TODO ...` comment, which explains why an update is needed (a link to documentation and a ticket is welcome). Needless to say, they must not lie there forever.

## Your turn!

In addition to existing TODOs, Some areas for improvement have been identified: a good place to start contributing?

### Setup

- Environment variables are not functional, yet;
- Typescript should be configured to be stricter than the defaults from Vite.
- A CSS compatibility needs to be handled, for instance with [autoprefixer](https://github.com/postcss/autoprefixer).
- Follow default documentation section in README.md and remove it.
- Code coverage and mutation testing are missing.

### Cleanup

- Overall, the CSS should be organised & cleaned, or migrated to CSS Modules or the like.
- Unit tests are missing.

### Industrialisation

- It has been assumed that the API key was intended to be public. If not, this needs fixing (move server side with some kind of validation).
- A parser like [Zod](https://zod.dev/) should be used to better validate API responses.
- API calls would probably be improved by using a library like Axios.

### Performance

- Limit the number of calls per X time during search. Solution 1: debounce updates to search; Solution 2: use a flag to prevent calls. Solution 2 has been implements, but may need challenging.
- Loading less films per request would help. Query parameters can also be modified to load less data.
- Caching results could be desirable, especially when implementing movie detail display. React context + reducer or a library such as RxJS would be useful.

### User experience

- Needless to say, UI needs improving.
- Errors have no feedback, which is evil.
- Used API endpoints should mix films and series. Also, API filters should be tweeked to needs.
- Aria attributes are missing, especially on the results overlay and button and the search field.
