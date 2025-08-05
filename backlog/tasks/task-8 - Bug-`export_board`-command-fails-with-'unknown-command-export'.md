---
id: task-8
title: 'Bug: `export_board` command fails with ''unknown command export'''
status: To Do
assignee: []
created_date: '2025-08-05 11:51'
labels:
  - bug
  - tool-issue
dependencies: []
---

## Description

The `export_board` tool (which maps to `npx backlog board export`) consistently fails with the error `error: unknown command 'export'`. **Steps to reproduce:** 1. Run `npx backlog board --help` to confirm `export` is a subcommand of `board`. 2. Attempt to use `export_board` via the MCP tool or directly via `npx backlog board export --readme --projectPath <path>`. **Expected behavior:** The command should export the Kanban board to the `README.md` file. **Actual behavior:** The command fails with `error: unknown command 'export'`. This prevents automated embedding of the Kanban board into documentation.
