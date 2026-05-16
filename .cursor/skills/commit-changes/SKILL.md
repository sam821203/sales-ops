---
name: commit-changes
description: Commit changes (multiple commits by relevance)
disable-model-invocation: true
---

# Commit changes (multiple commits by relevance)

When I run this command, do the following in order.

## 1. Read project conventions

- **[commit-message.mdc](rule:commit-message.mdc)** — use for every commit message.

## 2. Analyze local changes

- Run `git status` and `git diff --stat` (and `git diff` if needed) to see what is changed.
- **Group changes by relevance**: infer logical groupings (e.g. one group for API types, one for a specific feature, one for styling). Each group will become one commit.
- Do **not** create a new branch; work on the current branch only.

## 3. Plan commits

- Decide how many commits to create based on the groupings. Prefer **multiple commits** when changes clearly fall into distinct purposes (e.g. "refactor types" vs "update product edit modal" vs "fix lint").
- For each commit, choose:
  - **type** and **scope** from the rule (feat, fix, refactor, perf, style, test, docs, chore, build, ci + allowed scopes).
  - **subject**: imperative, lowercase, no period at the end.
- Order commits so that foundational or independent changes come first (e.g. types/API before UI that uses them).

## 4. Create commits

For each planned commit, in order:

1. Stage only the files that belong to that commit: `git add <path1> <path2> ...` (or `git add -p` for partial staging if a file has mixed changes).
2. Write the commit message in Conventional Commits form: `<type>(<scope>): <subject>`.
3. Run `git commit -m "..."`.

Repeat until all local changes are committed. If a file spans two logical changes, use `git add -p` to stage only the relevant hunks per commit.

## 5. Summarize

- List each commit created (hash optional): type, scope, subject.
- Confirm that all local changes are committed and no new branch was created.

Do not skip reading the rule; every commit message must pass the project's CI checks.
