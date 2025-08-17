# Tasks Documentation

Each work item (task/initiative) lives in its own subdirectory with a consistent, spec-first structure.

## Structure

- Create a new subdirectory per task using a clear, kebab-case name (e.g., `accountant-page-neumorphic-redesign`).
- Inside each task directory, always maintain these three documents:
  - `design.md` — design/architecture details and component structure
  - `requirements.md` — user stories and acceptance criteria
  - `tasks.md` — implementation plan with checklists and status

## Authoring Guidelines

- Always derive context from the PRD in `docs/prd/*` when writing or updating these docs.
- Keep documents focused and actionable; update checklists in `tasks.md` as work progresses.
- Do not add index files; each task directory is self-contained.

## Workflow

1. Create `docs/tasks/<task-name>/`.
2. Add `design.md`, `requirements.md`, and `tasks.md`.
3. As implementation proceeds, mark items in `tasks.md` with `[x]` when completed and add any follow-ups.
4. Keep references to PRD sections where helpful.
