---
name: commit-message
description: Commit message format and conventions enforced by commitlint; use when writing or suggesting git commit messages
---

# Commit Message Rule

All commit messages in this repo must follow the **Conventional Commits** format enforced by [commitlint.config.cjs](mdc:commitlint.config.cjs) and checked in [.github/workflows/commitlint.yml](mdc:.github/workflows/commitlint.yml).

## Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

- **type** and **scope** are required.
- Use lowercase for type and scope.
- Subject: imperative, lowercase (no period at the end). Example: "add login form" not "added login form".

## Allowed types

Use exactly one of:

| Type       | Use for |
|-----------|---------|
| `feat`    | New feature |
| `fix`     | Bug fix |
| `refactor`| Code change that neither fixes a bug nor adds a feature |
| `perf`    | Performance improvement |
| `style`   | Formatting, missing semicolons, etc. (no code logic change) |
| `test`    | Adding or updating tests |
| `docs`    | Documentation only |
| `chore`   | Maintenance (deps, tooling, etc.) |
| `build`   | Build system or external dependencies |
| `ci`      | CI configuration or scripts |

## Allowed scopes

Use exactly one of:

`ui`, `layout`, `page`, `component`, `hook`, `api`, `state`, `router`, `auth`, `permission`, `i18n`, `theme`, `devops`

## Examples

- `feat(auth): add forgot password flow`
- `fix(api): handle null product in price history`
- `docs(component): document Button props`
- `chore(build): bump vite to 5.x`
- `refactor(state): simplify cart store`

When suggesting or writing a commit message, always use this format with a valid type and scope so it passes commitlint on PR.
