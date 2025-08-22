# 📚 API Documentation

This document provides comprehensive documentation for all MCP tools available in the backlog.md server.

## 📖 Related Documentation

- [🏠 Back to README](../README.md)
- [🚀 Developer Guide](../DEVELOPER_GUIDE.md) - Development setup and guidelines
- [📝 Usage Examples](EXAMPLES.md) - Practical examples and workflows
- [🤝 Contributing](../CONTRIBUTING.md) - How to contribute new tools

---

## Tool Categories

### Task Management

#### `create_task`

Creates a new task in the backlog.

**Parameters:**

- `title` (required): The title of the task
- `description` (optional): Task description
- `assignee` (optional): Person assigned to the task
- `status` (optional): Task status
- `labels` (optional): Comma-separated list of labels
- `priority` (optional): Priority level (high, medium, low)
- `acceptanceCriteria` (optional): Comma-separated acceptance criteria
- `plan` (optional): Implementation plan
- `notes` (optional): Implementation notes
- `draft` (optional): Create as draft (boolean)
- `parent` (optional): Parent task ID
- `dependsOn` (optional): Comma-separated task dependencies
- `projectPath` (required): Path to the project directory

**Example:**

```json
{
  "title": "Implement user authentication",
  "description": "Add JWT-based authentication system",
  "assignee": "john.doe",
  "priority": "high",
  "labels": "backend,security",
  "acceptanceCriteria": "Login works,Tokens expire,Passwords hashed",
  "projectPath": "/path/to/project"
}
```

#### `edit_task`

Edits an existing task in the backlog.

**Parameters:**

- `id` (required): Task ID to edit
- `title` (optional): New task title
- `description` (optional): New description
- `assignee` (optional): New assignee
- `status` (optional): New status
- `label` (optional): Set new labels (comma-separated)
- `priority` (optional): New priority (high, medium, low)
- `addLabel` (optional): Add a label
- `removeLabel` (optional): Remove a label
- `acceptanceCriteria` (optional): Set acceptance criteria
- `addAc` (optional): Add acceptance criteria
- `removeAc` (optional): Remove acceptance criteria
- `clearAc` (optional): Clear all acceptance criteria
- `plan` (optional): New implementation plan
- `notes` (optional): New implementation notes
- `dependsOn` (optional): Set dependencies
- `addDep` (optional): Add dependency
- `removeDep` (optional): Remove dependency
- `clearDep` (optional): Clear all dependencies
- `clearLabels` (optional): Clear all labels
- `parent` (optional): Set parent task ID
- `projectPath` (required): Path to the project directory

#### `view_task`

Views details of a specific task.

**Parameters:**

- `id` (required): Task ID to view
- `plain` (optional): View in plain mode for AI (default: true)
- `projectPath` (required): Path to the project directory

#### `list_tasks`

Lists tasks with optional filtering.

**Parameters:**

- `assignee` (optional): Filter by assignee
- `parent` (optional): Filter by parent task ID
- `plain` (optional): View in plain mode for AI (default: true)
- `priority` (optional): Filter by priority
- `sort` (optional): Sort tasks by field (priority, id)
- `status` (optional): Filter by status
- `projectPath` (required): Path to the project directory

#### `archive_task`

Archives one or more completed tasks.

**Parameters:**

- `id` (optional): Single task ID to archive
- `ids` (optional): Comma-separated task IDs to archive
- `projectPath` (required): Path to the project directory

**Note:** Either `id` or `ids` must be provided.

### Draft Management

#### `create_draft`

Creates a draft task.

**Parameters:**

- `title` (required): Draft title
- `description` (optional): Draft description
- `assignee` (optional): Assignee
- `status` (optional): Status
- `labels` (optional): Comma-separated labels
- `projectPath` (required): Path to the project directory

#### `promote_draft`

Promotes a draft to an active task.

**Parameters:**

- `id` (required): Draft ID to promote
- `projectPath` (required): Path to the project directory

#### `demote_task`

Demotes a task back to draft status.

**Parameters:**

- `id` (required): Task ID to demote
- `projectPath` (required): Path to the project directory

### Documentation Management

#### `create_doc`

Creates a new documentation file.

**Parameters:**

- `title` (required): Document title
- `path` (optional): Path to create document in
- `type` (optional): Document type
- `projectPath` (required): Path to the project directory

#### `list_docs`

Lists all documentation files.

**Parameters:**

- `plain` (optional): View in plain mode for AI (default: true)
- `projectPath` (required): Path to the project directory

#### `view_doc`

Views content of a specific document.

**Parameters:**

- `id` (required): Document ID to view
- `projectPath` (required): Path to the project directory

### Decision Management

#### `create_decision`

Creates a new decision record.

**Parameters:**

- `title` (required): Decision title
- `status` (optional): Decision status
- `projectPath` (required): Path to the project directory

### Project Management

#### `config_list`

Lists current project configuration.

**Parameters:**

- `projectPath` (required): Path to the project directory

#### `config_set`

Updates project configuration settings.

**Parameters:**

- `key` (required): Configuration key to set
- `value` (required): Value to set for the key
- `projectPath` (required): Path to the project directory

#### `cleanup`

Cleans up completed tasks.

**Parameters:**

- `projectPath` (required): Path to the project directory

#### `export_board`

Exports the Kanban board to a markdown file.

**Parameters:**

- `exportVersion` (optional): Version to include in export
- `file` (optional): Output file path
- `force` (optional): Force overwrite existing file (boolean)
- `readme` (optional): Export to README.md with markers (boolean)
- `projectPath` (required): Path to the project directory

#### `browser`

Launches the web UI for backlog management.

**Parameters:**

- `noOpen` (optional): Don't open browser automatically (default: true)
- `port` (optional): Port for the web UI
- `projectPath` (required): Path to the project directory

#### `update_agent_instructions`

Updates agent instruction files.

**Parameters:**

- `projectPath` (required): Path to the project directory

## Error Handling

All tools implement robust error handling with:

- Input validation using Zod schemas
- Retry logic with exponential backoff for transient failures
- Custom error types (`CliError`, `SystemError`) for better context
- Comprehensive logging for debugging

## Security Features

- Command injection prevention through argument sanitization
- Path validation to prevent directory traversal
- Secure command execution using `execFile` when possible
- Input validation for all parameters

## Response Format

All tools return responses in the MCP standard format:

```json
{
  "content": [
    {
      "type": "text",
      "text": "Operation result",
      "_meta": {
        "successMessage": "Operation completed successfully"
      }
    }
  ]
}
```

## Common Usage Patterns

### Creating and Managing Tasks

```json
// Create a task
{
  "title": "Fix login bug",
  "description": "Users cannot log in with special characters",
  "priority": "high",
  "labels": "bug,frontend",
  "projectPath": "/path/to/project"
}

// Edit the task
{
  "id": "task-1",
  "status": "in-progress",
  "addLabel": "urgent",
  "projectPath": "/path/to/project"
}

// Archive when complete
{
  "id": "task-1",
  "projectPath": "/path/to/project"
}
```

### Working with Drafts

```json
// Create draft
{
  "title": "Future feature idea",
  "description": "Consider implementing this later",
  "projectPath": "/path/to/project"
}

// Promote when ready
{
  "id": "draft-1",
  "projectPath": "/path/to/project"
}
```

### Documentation Workflow

```json
// Create documentation
{
  "title": "API Documentation",
  "type": "api",
  "projectPath": "/path/to/project"
}

// List all docs
{
  "projectPath": "/path/to/project"
}
```

---

## 📖 See Also

- [📝 Usage Examples](EXAMPLES.md) - Practical workflows using these APIs
- [🚀 Developer Guide](../DEVELOPER_GUIDE.md) - Adding new tools and development
- [🤝 Contributing](../CONTRIBUTING.md) - Contributing new MCP tools
- [🔒 Security](../SECURITY.md) - Security considerations for tool usage

These APIs provide the foundation for flexible and powerful project management workflows. Combined properly, they enable comprehensive task management for projects of any size and complexity.
