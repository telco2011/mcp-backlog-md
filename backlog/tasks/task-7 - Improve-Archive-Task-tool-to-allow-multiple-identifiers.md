---
id: task-7
title: Improve Archive Task tool to allow multiple identifiers
status: To Do
assignee: []
created_date: '2025-07-25'
labels: []
dependencies: []
priority: medium
---

## Description

The `Archive Task` tool currently only accepts a single task ID. This should be improved to allow archiving multiple tasks at once by providing a comma-separated list of task IDs.

## Acceptance Criteria

- [ ] The `Archive Task` tool should accept a new parameter
- [ ] `ids`
- [ ] which is a comma-separated string of task IDs.
- [ ] The tool should iterate through the provided IDs and archive each task.
- [ ] The tool should provide a summary of the archived tasks.
- [ ] The existing `id` parameter should be maintained for backward compatibility
- [ ] but its use should be deprecated in the documentation.

## Implementation Plan

1. Update the `archiveTask.ts` tool definition to accept an array of strings for the `id` parameter.
2. Modify the `execute` function to handle both a single ID and an array of IDs.
3. Update the command-line interface to parse multiple IDs.
4. Update the tool's documentation to reflect the changes.
5. Add unit tests to cover the new functionality.
