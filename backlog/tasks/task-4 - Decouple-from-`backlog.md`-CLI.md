---
id: task-4
title: Decouple from `backlog.md` CLI
status: To Do
assignee: []
created_date: '2025-07-24'
labels:
  - architecture
  - refactor
dependencies: []
priority: high
---

## Description

Refactor the application to interact with the backlog data directly instead of shelling out to the `backlog.md` CLI. This involves creating a library for reading and writing the markdown files directly. This will remove the dependency on the CLI and make the system more robust and scalable.

## Implementation Plan

1. Design a library for reading and writing backlog markdown files.\n2. Implement the library with functions for all the operations currently handled by the CLI.\n3. Refactor the tool execution logic to use the new library instead of `executeCommand`.\n4. Ensure all existing tests pass with the new implementation.
