---
id: task-7
title: Improve Archive Task tool to allow multiple identifiers
status: In Progress
assignee: []
created_date: '2025-07-25'
updated_date: '2025-07-26'
labels: []
dependencies: []
priority: medium
---

## Description

The `Archive Task` tool currently only accepts a single task ID. This should be improved to allow archiving multiple tasks at once by providing a comma-separated list of task IDs.

## Acceptance Criteria

- [ ] - [x] The  tool should accept a new parameter
- [x] 
- [x] which is a comma-separated string of task IDs.
- [x] The tool should iterate through the provided IDs and archive each task.
- [x] The tool should provide a summary of the archived tasks.
- [x] The existing uid=1000(kratos) gid=1000(kratos) groups=1000(kratos)
- [ ] 4(adm)
- [ ] 24(cdrom)
- [ ] 27(sudo)
- [ ] 30(dip)
- [ ] 46(plugdev)
- [ ] 100(users)
- [ ] 104(kvm)
- [ ] 119(lpadmin)
- [ ] 129(sambashare)
- [ ] 133(libvirt)
- [ ] 993(ollama)
- [ ] 995(docker) parameter should be maintained for backward compatibility
- [x] but its use should be deprecated in the documentation.
## Implementation Plan

1. Update the `archiveTask.ts` tool definition to accept an array of strings for the `id` parameter.
2. Modify the `execute` function to handle both a single ID and an array of IDs.
3. Update the command-line interface to parse multiple IDs.
4. Update the tool's documentation to reflect the changes.
5. Add unit tests to cover the new functionality.

## Implementation Notes

Updated the  tool to accept multiple task IDs via a new  parameter. The uid=1000(kratos) gid=1000(kratos) groups=1000(kratos),4(adm),24(cdrom),27(sudo),30(dip),46(plugdev),100(users),104(kvm),119(lpadmin),129(sambashare),133(libvirt),993(ollama),995(docker) parameter is now optional, but at least one of uid=1000(kratos) gid=1000(kratos) groups=1000(kratos),4(adm),24(cdrom),27(sudo),30(dip),46(plugdev),100(users),104(kvm),119(lpadmin),129(sambashare),133(libvirt),993(ollama),995(docker) or  must be provided. The  function was updated to handle both single and multiple IDs, and to return a summary of the archived tasks. Also fixed a TypeScript error and an ESLint warning.
