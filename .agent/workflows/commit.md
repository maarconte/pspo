---
description: Generate a complete commit message following project rules
---

# Generate Commit Message Workflow

This workflow generates a complete, properly formatted commit message following the project's strict Conventional Commits rules.

## Steps:

1. Check current Git status to see all staged and unstaged changes
// turbo
2. Analyze the changes to understand what was modified
3. Generate a commit message in the following format:
   - **Title**: `type(scope): imperative description (max 50 chars)`
   - **Body**: Bullet points explaining what and why (wrap at 72 chars)
4. Follow these rules strictly:
   - Types: feat, fix, docs, style, refactor, test, chore
   - Use imperative mood (add, not added)
   - No Markdown formatting (no **, *, or `)
   - Use bullet points (- ) for all details in body
   - Leave blank line between title and body
   - Explain WHAT changed and WHY
   - No redundancy between title and body

## Example Output:

```
feat(quiz): add collaborative session support

- Implement real-time session synchronization with Firebase
- Add ActiveSession component for live participant tracking
- Create session store using Zustand for state management
- Update API endpoints to handle multi-user sessions
```

## Usage:

Simply type `/commit` in the chat to trigger this workflow.
