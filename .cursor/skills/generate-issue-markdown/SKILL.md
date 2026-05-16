---
name: generate-issue-markdown
description: Generate English issue markdown
disable-model-invocation: true
---

# Generate English issue markdown

When I run this command, generate a **single, copyable English issue** in Markdown format that I can paste into GitHub, GitLab, Jira, or similar. Output it inside a **fenced code block** (language: `markdown`) so I can **click the copy button** on the block to copy in one go. The issue must be **based on the current branch and all commits on that branch**.

## 1. Analyze current branch and its commits

- Run in the repo (e.g. SalesOps): `git branch --show-current` to get the current branch name.
- Determine the base branch (e.g. `develop` or `main`). Use `develop` if it exists, otherwise `main`.
- List **all commits on the current branch** that are not on the base:  
  `git log <base>..HEAD --oneline` (e.g. `git log develop..HEAD --oneline`).
- Optionally run `git log <base>..HEAD --stat` or `git diff <base>..HEAD --stat` to see which files changed.
- From the **branch name** and **commit messages** (and changed files), infer:
  - The **purpose** of the work (feature, bugfix, chore, refactor, etc.).
  - A concise **title** and **description** for the issue.
  - **Acceptance criteria** that match what the commits implement.
- If the branch has no commits yet or commits are empty/vague, you may use chat context or ask me one short question to clarify.

## 2. Generate the issue markdown from branch + commits

Using the current branch name and commit history from step 1, produce **one** markdown block that includes:

- **Title**: One short line (e.g. `[Bug] Price history does not load on mobile` or `[Feature] Export price history to CSV`).
- **Description**: 1–3 sentences explaining the issue or feature in plain English.
- **Steps to reproduce** (for bugs) or **Proposed solution** (for features): Bullet list.
- **Acceptance criteria**: Bullet list of what “done” looks like.
- **Additional context** (optional): Environment, links, screenshots note, etc., only if relevant.

Use this structure (adapt section names if the user prefers GitHub/GitLab style):

```markdown
## Title
[Brief one-line title, e.g. [Bug] / [Feature] / [Chore] ...]

## Description
...

## Steps to reproduce / Proposed solution
- ...

## Acceptance criteria
- ...

## Additional context (optional)
...
```

## 3. Output for click-to-copy

- **Lead with the issue.** Do not add a preamble (e.g. "Here is the issue..." or "Based on the branch..."). Start the reply with a code fence so the user can use the **copy button** on the code block.
- Wrap the **entire** issue markdown in a **single fenced code block** with language `markdown`:

  ````markdown
  ```markdown
  ## Title
  ...

  ## Description
  ...
  ```
  ````

  This way the rendered reply shows a code block with a copy button (click to copy the full markdown in one go). Pasting into GitHub/GitLab/Jira will preserve the markdown.
- Write in clear, professional English; keep it concise.
- Optionally add a short line under **Additional context** like: `Branch: <branch-name>` so the issue is traceable to the branch.
