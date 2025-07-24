---
id: task-3
title: Update Tool Schemas to Match CLI Definitions
status: Done
assignee:
  - Cline
created_date: '2025-07-24'
updated_date: '2025-07-24'
labels:
  - refactor
  - schema
  - mcp
dependencies: []
priority: high
---

## Description

Analyze docs/cli.ts and update all tool schemas in src/tools to accurately reflect the commands, options, and descriptions defined in the CLI.

## Acceptance Criteria

- [x] - All tool schemas in `src/tools` match their corresponding command definitions in `docs/cli.ts`
- [x] - Descriptions for all tool parameters are present and accurate
- [x] - The `mcp-inspector` tool shows the updated and correct schemas for all tools.

## Implementation Plan

1. **Analyze `docs/cli.ts`:** Thoroughly read `docs/cli.ts` to create a complete map of all `commander` commands, aliases, options, and descriptions.\n2. **Review Existing Tools:** Systematically review each file in the `src/tools/` directory.\n3. **Identify Gaps:** For each tool, compare its current Zod schema against the command definition in `docs/cli.ts`. Note any missing options, incorrect types, or inadequate descriptions.\n4. **Update `editTask.ts`:**\n    - Read the file `src/tools/editTask.ts`.\n    - Update its Zod schema to include all options from `task edit` command (`--title`, `--description`, `--assignee`, `--status`, `--label`, `--priority`, `--add-label`, `--remove-label`, `--ac`, `--plan`, `--notes`, `--depends-on`).\n    - Add detailed descriptions for each option.\n    - Verify the `execute` function handles the new options.\n5. **Update `createTask.ts`:**\n    - Read the file `src/tools/createTask.ts`.\n    - Update its Zod schema to match the `task create` command.\n    - Ensure all options are correctly typed and described.\n6. **Update Remaining Tools:** Repeat the process for all other tools in the `src/tools` directory, ensuring each one perfectly matches its corresponding CLI command.

## Implementation Notes

Started work on task. First step is to update  schema and execution logic.

Started work on task. First step is to update `createTask.ts` schema and execution logic.

Updated `src/tools/createTask.ts` to align its Zod schema and execution logic with the CLI definitions. The schema now includes detailed descriptions and uses the primary option names.

Updated `src/tools/editTask.ts` to align its Zod schema and execution logic with the CLI definitions. The schema now includes all available options from the `task edit` command.

Updated `src/tools/listTasks.ts` to include the `priority` and `sort` options, aligning it with the CLI definitions.

Updated `src/tools/createDraft.ts` to include `description`, `assignee`, `status`, and `labels` options, aligning it with the CLI definitions.

Updated `src/tools/listDocs.ts` to include the `plain` option, aligning it with the CLI definitions.

Updated `src/tools/exportBoard.ts` to include the `readme` and `exportVersion` options, aligning it with the CLI definitions.

Completed all schema updates for the tools. Total time spent: ~8 minutes.
