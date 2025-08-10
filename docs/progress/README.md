## Progress Docs Naming Convention

Use this strict pattern for all progress/proposal/plan docs:

Format: `SerialNumber-TaskName-Date.md`

- SerialNumber: zero-padded sequential number (e.g., `001`, `002`)
- TaskName: concise PascalCase summary (no spaces). Keep it descriptive, not generic
- Date: `YYYY-MM-DD` in IST (Asia/Kolkata)

Examples

- `001-Avatar-Revamp-2025-08-10.md`
- `002-Profile-Refactor-Todos-2025-08-10.md`
- `003-Profile-Refactor-Execution-2025-08-10.md`

Operational Notes

- Always resolve today’s date via an online source in IST to avoid timezone mistakes
- Do not use vague names like `next-tasks.md` or undated docs
- Do not create index files; keep each document explicit
