---
id: task-14
title: Implement Comprehensive MCP Tool Coverage for backlog.md CLI
status: Done
assignee: []
created_date: '2025-08-22 16:24'
labels:
  - enhancement
  - mcp
  - tools
  - coverage
dependencies: []
priority: high
---

## Description

Achieve 92% CLI coverage by implementing missing MCP tools and enhancing existing ones to comprehensively wrap the official backlog.md CLI commands. This includes adding draft management tools, board viewing capabilities, configuration management, and enhanced task/draft operations.

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Implement listDrafts MCP tool with sorting options, Implement archiveDraft MCP tool for single/multiple drafts, Implement viewDraft MCP tool with plain mode support, Implement viewBoard MCP tool for board visualization, Implement configGet MCP tool for configuration retrieval, Enhance editTask with comprehensive CLI options, Enhance createTask with desc and ordinal options, Achieve 92% CLI command coverage
<!-- AC:END -->

## Implementation Plan

1. Analyze backlog.md CLI documentation to identify missing commands
2. Implement 5 new MCP tools: listDrafts, archiveDraft, viewDraft, viewBoard, configGet
3. Enhance existing tools with missing CLI options (desc, ordinal, AC management)
4. Map all CLI options accurately to avoid non-existent commands
5. Test integration with backlog.md CLI wrapper
6. Document comprehensive CLI coverage achievement

## Implementation Notes

Used deepwiki MCP tool to analyze official backlog.md CLI documentation. Implemented comprehensive option mapping including acceptance criteria management with --check-ac, --uncheck-ac, --remove-ac commands. Avoided non-existent options like clearAc, clearLabels, clearDep after careful documentation review.
