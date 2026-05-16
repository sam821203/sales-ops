---
name: branch-and-commit
description: Branch from develop and commit all changes
disable-model-invocation: true
---

# Branch from develop and commit all changes

When I run this command, do the following in order.

## 1. Read project conventions

- **[branch-naming.mdc](rule:branch-naming.mdc)** — use for the new branch name.
- **[commit-message.mdc](rule:commit-message.mdc)** — use for every commit message.

## 2. Analyze local changes

- Run `git status` and `git diff --stat` (and `git diff` if needed) to see what is changed.
- Infer the **purpose** of the work (e.g. new feature, bugfix, styling, docs, refactor) for the branch name and the single commit message.

## 3. Create a new branch from develop

- Ensure we are in the SalesOps repo and **create a new branch from `develop`**.
- Branch name must follow the rule: `<prefix>/<slug>` (e.g. `feature/sku-price-history`, `chore/update-tailwind`).
- Choose **prefix** from: `feature`, `bugfix`, `hotfix`, `release`, `chore`, `docs`, `refactor`, `test`.
- **Slug**: lowercase letters and digits only, separated by `-` or `/` (no spaces or underscores).
- Suggest **one** branch name that matches the overall change; if I have mixed work, pick the dominant one or ask me.
- For work on Cursor commands and rules, prefer a branch name based on that (e.g. `chore/implement-cursor-commands-and-rules` or `chore/cursor-commands-rules`).

**Steps to run:**

1. `git fetch origin develop` (if you use remote).
2. `git checkout develop` then `git pull` (or `git pull origin develop`) so develop is up to date.
3. `git checkout -b <prefix>/<slug>` with the chosen name.

## 4. Commit all local changes

- **Stage every changed file**: run `git add -A` (or `git add .`) so all local changes are staged.
- Write **one** commit message in Conventional Commits form:  
  `<type>(<scope>): <subject>`  
  using only allowed **types** (feat, fix, refactor, perf, style, test, docs, chore, build, ci) and **scopes** (ui, layout, page, component, hook, api, state, router, auth, permission, i18n, theme, devops).
- Subject: imperative, lowercase, no period at the end. Base the message on the overall purpose of the work.
- Run `git commit -m "..."` once to create a **single commit** that includes all staged changes.

## 5. Summarize

- Tell me the branch name you created.
- Tell me the single commit message and that all local changes were included.

Do not skip reading the rules; the branch name and every commit message must pass the project’s CI checks.
