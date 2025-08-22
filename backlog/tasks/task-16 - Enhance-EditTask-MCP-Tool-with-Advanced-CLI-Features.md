---
id: task-16
title: Enhance EditTask MCP Tool with Advanced CLI Features
status: Done
assignee: []
created_date: '2025-08-22 16:24'
labels:
  - enhancement
  - mcp
  - tools
  - cli-mapping
dependencies: []
priority: medium
---

## Description

Comprehensively enhance the editTask MCP tool to support all advanced backlog.md CLI features including acceptance criteria management, ordinal positioning, alternative description fields, and comprehensive option mapping. Focus on proper CLI command construction and validation.

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Add desc parameter as alternative to description, Add ordinal parameter for task positioning, Implement checkAc parameter for marking acceptance criteria complete, Implement unCheckAc parameter for unmarking acceptance criteria, Implement removeAc parameter for removing acceptance criteria, Ensure proper CLI command construction with correct option flags, Validate against official backlog.md CLI documentation
<!-- AC:END -->

## Implementation Plan

1. Analyze current editTask implementation gaps
2. Add missing Zod schema parameters (desc, ordinal, checkAc, unCheckAc, removeAc)
3. Implement proper command construction with correct CLI flags
4. Map acceptance criteria operations to numbered indexing (1-based)
5. Validate CLI option compatibility with official documentation
6. Test comprehensive parameter combinations
7. Update TypeScript interfaces and validation

## Implementation Notes

Enhanced editTask.ts with comprehensive CLI option support. Added desc (alternative description), ordinal (positioning), and AC management (checkAc, unCheckAc, removeAc) with proper 1-based indexing. Verified all CLI flags match official documentation. Improved branch coverage from 47.36% to 100% through comprehensive testing.
