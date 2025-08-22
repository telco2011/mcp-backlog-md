---
id: task-13
title: Fix MCP Tool Command Parsing Bug
status: Done
assignee: []
created_date: '2025-08-22 13:58'
updated_date: '2025-08-22 16:00'
labels:
  - bug
  - mcp
  - tooling
dependencies: []
priority: high
---

## Description

Fix the command parsing bug in commandExecutor.ts where quoted arguments aren't handled properly, affecting multi-word titles and descriptions in MCP tool operations. The current parseCommand function fails when encountering multi-word strings in quotes, causing "too many arguments" errors.

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Multi-word titles work correctly in createTask operations
- [x] #2 Multi-word descriptions work correctly in editTask operations  
- [x] #3 Quoted arguments are parsed correctly in all MCP tools
- [x] #4 All MCP tool operations work with complex strings containing spaces
- [x] #5 Command parsing handles both single and double quotes properly
<!-- AC:END -->
## Implementation Notes

The issue is in the parseCommand function in commandExecutor.ts. A partial fix was implemented but needs completion to properly handle quoted arguments. The current approach using simple string splitting doesn't respect quoted boundaries.

### Considerations

You can use the deepwiki mcp tool to review the MrLesk/Backlog.md repository documentation to see how backlog command works.
After the changes are done and the build is done, you must reconnect the mcp-backlog-md-local mcp tool and you can use it to check if the changes work.

COMPLETED: Fixed parseCommand function in commandExecutor.ts to properly handle quoted arguments. Multi-word titles and descriptions now work correctly in all MCP tools. Added comprehensive tests covering various quote scenarios. All acceptance criteria have been verified through integration testing.

## Error Examples

- `"error: too many arguments for 'create'. Expected 1 argument but got 19"` when creating tasks with multi-word titles
- `"error: too many arguments for 'edit'. Expected 1 argument but got X"` when editing tasks with quoted parameters
