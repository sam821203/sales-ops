# Generate PR markdown from current branch commits

When I run this command, generate a **single, copyable PR description** in Markdown that follows the repo’s pull request template. The content must be **based on the current branch and all commits on that branch**.

## 1. Analyze current branch and its commits

- Run in the repo (e.g. SalesOps): `git branch --show-current` to get the current branch name.
- Determine the base branch: use `develop` if it exists, otherwise `main`.
- List **all commits on the current branch** not on the base:  
  `git log <base>..HEAD --oneline` (e.g. `git log develop..HEAD --oneline`).
- Optionally run `git log <base>..HEAD --stat` or `git diff <base>..HEAD --stat` to see which files changed.
- From the **branch name** and **commit messages** (and changed files), infer:
  - The **problem** this PR solves and the **approach** taken.
  - A concise bullet list of **changes** (one line per logical change, derived from commits).
  - The **scope(s)** that best match the work (ui, layout, page, component, hook, api, state, router, auth, permission, i18n, theme, devops).
- If the branch has no commits yet or commits are empty/vague, you may use chat context or ask me one short question to clarify.

## 2. Output format: follow the pull request template

Use **exactly** the structure from `.github/pull_request_template.md`:

```markdown
## Summary
- What problem does this PR solve?
- What approach did you take?

## Changes
- 

## Scope
Select one (aligns with `commitlint.config.cjs` scopes):
- [ ] ui
- [ ] layout
- [ ] page
- [ ] component
- [ ] hook
- [ ] api
- [ ] state
- [ ] router
- [ ] auth
- [ ] permission
- [ ] i18n
- [ ] theme
- [ ] devops

## Screenshots / Recording (if UI changes)
- Before:
- After:

## Test plan
- [ ] `npm run lint`
- [ ] `npm test` (if applicable)
- [ ] Manual check:
  - [ ] Works on Chrome
  - [ ] Works on Safari (if applicable)

## Checklist
- [ ] I kept the PR small and focused (or explained why not)
- [ ] I updated docs/README if needed
- [ ] I added/updated tests if needed
- [ ] No secrets or credentials are included

## Related
- Fixes #<issue-number>
- Follow-ups:
```

## 3. What to pre-fill from branch + commits

- **Summary**: Fill in “What problem does this PR solve?” and “What approach did you take?” using branch name and commit history. One short bullet each.
- **Changes**: List concrete changes as bullets (e.g. “Add SKU price history API endpoint”, “Add PriceHistoryPage view”). One bullet per logical change; derive from commit messages and/or file changes.
- **Scope**: Pre-check the **one** scope that best matches the work (replace `- [ ]` with `- [x]` for that scope). If multiple scopes apply, pick the primary one or leave one checked and mention the other in Summary/Changes.
- Leave **Screenshots / Recording**, **Test plan**, **Checklist**, and **Related** as in the template (user fills these).

## 4. Output for copying (click-to-copy format)

- **Wrap the PR markdown in a markdown code fence** so the chat UI shows a **Copy** button for one-click copy: start the reply with a line of triple backticks + `markdown`, then the full PR body, then a closing line of triple backticks (i.e. output in a fenced code block so the chat shows a Copy button).
- You may add one short line before the code block (e.g. "Click the copy button above to copy.").
- Write the content inside the fence in clear, professional English; keep Summary and Changes concise.
- Optionally add under **Related** or at the very end: `Branch: <branch-name>` so the PR is traceable.
- The user will click copy on the code block, then paste into GitHub.
