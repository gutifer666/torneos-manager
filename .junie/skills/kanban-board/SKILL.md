---
name: kanban-board
description: Manage the kanban board. List, read, and close GitHub issues.
---

# Kanban Board

Repository: `gutifer666/torneos-manager`

All commands require `--repo gutifer666/torneos-manager`.

## Commands

List open issues:
```bash
gh issue list --repo gutifer666/torneos-manager
```

View a specific issue:
```bash
gh issue view <number> --repo gutifer666/torneos-manager
```

Close an issue:
```bash
gh issue close <number> --repo gutifer666/torneos-manager
```

## Behavior

### Without arguments

List all open issues and show a summary to the user.

### With an issue ID as argument (e.g. `/kanban-board 42`)

1. **Read** the issue using `gh issue view <id>`.
2. **Analyze** the description, acceptance criteria, and labels.
3. **Present an implementation plan** to the user with:
    - Summary of what the issue asks for.
    - Potential risks or open questions.

### After completing work on an issue

Close the issue with a comment summarizing what was done:
```bash
gh issue close <number> --repo gutifer666/torneos-manager --comment "Done: <brief summary>"
```