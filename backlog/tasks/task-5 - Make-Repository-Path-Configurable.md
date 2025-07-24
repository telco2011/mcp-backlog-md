---
id: task-5
title: Make Repository Path Configurable
status: To Do
assignee: []
created_date: '2025-07-24'
labels:
  - architecture
  - configuration
dependencies: []
priority: medium
---

## Description

The `REPO_PATH` is currently hardcoded in `src/lib/commandExecutor.ts`. This should be externalized to make the tool more flexible and portable. The path should be configurable via an environment variable or a configuration file.

## Implementation Plan

1. Modify `src/lib/commandExecutor.ts` to read the repository path from an environment variable (e.g., `BACKLOG_REPO_PATH`).\n2. If the environment variable is not set, fall back to the current working directory or a default path.\n3. Update the documentation to explain how to configure the repository path.
