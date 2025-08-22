# 📝 Usage Examples

This document provides practical examples of using the MCP backlog.md server in various scenarios.

## 📖 Related Documentation

- [🏠 Back to README](../README.md)
- [📚 API Reference](API.md) - Complete tool documentation
- [🚀 Developer Guide](../DEVELOPER_GUIDE.md) - Development and customization
- [🤝 Contributing](../CONTRIBUTING.md) - Adding your own examples

---

## Complete Project Workflow

### 1. Setting Up a New Project

```json
// Initialize backlog configuration
{
  "tool": "config_set",
  "params": {
    "key": "project_name",
    "value": "My Awesome App",
    "projectPath": "/home/user/projects/awesome-app"
  }
}
```

### 2. Creating Initial Tasks

```json
// Create a high-priority task
{
  "tool": "create_task",
  "params": {
    "title": "Set up project structure",
    "description": "Initialize the basic project structure with folders and configuration files",
    "priority": "high",
    "labels": "setup,infrastructure",
    "acceptanceCriteria": "Folders created,Package.json configured,README added",
    "assignee": "tech-lead",
    "projectPath": "/home/user/projects/awesome-app"
  }
}

// Create a dependent task
{
  "tool": "create_task",
  "params": {
    "title": "Implement user authentication",
    "description": "Add JWT-based authentication with login/logout functionality",
    "priority": "high",
    "labels": "backend,security,authentication",
    "dependsOn": "task-1",
    "acceptanceCriteria": "Login endpoint works,JWT tokens generated,Password hashing implemented",
    "plan": "1. Set up JWT library\n2. Create auth middleware\n3. Implement login/logout routes\n4. Add password hashing\n5. Write tests",
    "assignee": "backend-dev",
    "projectPath": "/home/user/projects/awesome-app"
  }
}
```

### 3. Managing Task Progress

```json
// Start working on a task
{
  "tool": "edit_task",
  "params": {
    "id": "task-1",
    "status": "in-progress",
    "addLabel": "active",
    "projectPath": "/home/user/projects/awesome-app"
  }
}

// Add implementation notes during development
{
  "tool": "edit_task",
  "params": {
    "id": "task-1",
    "notes": "Using TypeScript for better type safety. Added ESLint and Prettier for code quality.",
    "addAc": "TypeScript configuration added",
    "projectPath": "/home/user/projects/awesome-app"
  }
}

// Mark task as complete
{
  "tool": "edit_task",
  "params": {
    "id": "task-1",
    "status": "completed",
    "removeLabel": "active",
    "addLabel": "done",
    "projectPath": "/home/user/projects/awesome-app"
  }
}
```

## Team Collaboration Scenarios

### Assigning Tasks to Team Members

```json
// Create tasks for different team members
{
  "tool": "create_task",
  "params": {
    "title": "Design user interface mockups",
    "description": "Create wireframes and mockups for the main user interface",
    "assignee": "ui-designer",
    "priority": "medium",
    "labels": "design,frontend,ui",
    "acceptanceCriteria": "Wireframes created,Color scheme defined,Component library outlined",
    "projectPath": "/home/user/projects/awesome-app"
  }
}

// List tasks by assignee to see workload
{
  "tool": "list_tasks",
  "params": {
    "assignee": "ui-designer",
    "projectPath": "/home/user/projects/awesome-app"
  }
}
```

### Creating Parent-Child Task Relationships

```json
// Create a parent task
{
  "tool": "create_task",
  "params": {
    "title": "User Management System",
    "description": "Complete user management functionality including CRUD operations",
    "priority": "high",
    "labels": "epic,backend,users",
    "projectPath": "/home/user/projects/awesome-app"
  }
}

// Create child tasks
{
  "tool": "create_task",
  "params": {
    "title": "User Registration API",
    "description": "Implement user registration endpoint with validation",
    "parent": "task-3",
    "priority": "high",
    "labels": "backend,api,users",
    "acceptanceCriteria": "Registration endpoint created,Email validation added,Duplicate user prevention",
    "projectPath": "/home/user/projects/awesome-app"
  }
}
```

## Documentation Workflows

### Creating Technical Documentation

```json
// Create API documentation
{
  "tool": "create_doc",
  "params": {
    "title": "REST API Documentation",
    "type": "api",
    "projectPath": "/home/user/projects/awesome-app"
  }
}

// Create deployment guide
{
  "tool": "create_doc",
  "params": {
    "title": "Deployment Guide",
    "type": "deployment",
    "path": "docs/operations",
    "projectPath": "/home/user/projects/awesome-app"
  }
}

// List all documentation
{
  "tool": "list_docs",
  "params": {
    "projectPath": "/home/user/projects/awesome-app"
  }
}
```

### Decision Records

```json
// Document an architectural decision
{
  "tool": "create_decision",
  "params": {
    "title": "Choose React over Vue for frontend framework",
    "status": "accepted",
    "projectPath": "/home/user/projects/awesome-app"
  }
}
```

## Sprint Management

### Planning a Sprint

```json
// Create draft tasks for sprint planning
{
  "tool": "create_draft",
  "params": {
    "title": "Implement search functionality",
    "description": "Add search capability to the main dashboard",
    "labels": "frontend,search,enhancement",
    "projectPath": "/home/user/projects/awesome-app"
  }
}

// Promote approved drafts to tasks
{
  "tool": "promote_draft",
  "params": {
    "id": "draft-1",
    "projectPath": "/home/user/projects/awesome-app"
  }
}

// List tasks by priority for sprint planning
{
  "tool": "list_tasks",
  "params": {
    "priority": "high",
    "sort": "priority",
    "projectPath": "/home/user/projects/awesome-app"
  }
}
```

### End of Sprint Cleanup

```json
// Archive completed tasks
{
  "tool": "archive_task",
  "params": {
    "ids": "task-1,task-2,task-5",
    "projectPath": "/home/user/projects/awesome-app"
  }
}

// Clean up the board
{
  "tool": "cleanup",
  "params": {
    "projectPath": "/home/user/projects/awesome-app"
  }
}

// Export sprint report
{
  "tool": "export_board",
  "params": {
    "file": "sprint-1-report.md",
    "exportVersion": "Sprint 1 - User Authentication",
    "projectPath": "/home/user/projects/awesome-app"
  }
}
```

## Advanced Task Management

### Complex Task Dependencies

```json
// Create a task with multiple dependencies
{
  "tool": "create_task",
  "params": {
    "title": "Deploy to production",
    "description": "Deploy the application to production environment",
    "dependsOn": "task-10,task-11,task-12",
    "priority": "high",
    "labels": "deployment,production,release",
    "acceptanceCriteria": "All tests pass,Database migrations run,Monitoring configured",
    "projectPath": "/home/user/projects/awesome-app"
  }
}

// Add a dependency later
{
  "tool": "edit_task",
  "params": {
    "id": "task-15",
    "addDep": "task-13",
    "projectPath": "/home/user/projects/awesome-app"
  }
}
```

### Bulk Task Operations

```json
// Edit multiple aspects of a task at once
{
  "tool": "edit_task",
  "params": {
    "id": "task-8",
    "status": "blocked",
    "addLabel": "blocked",
    "removeLabel": "in-progress",
    "notes": "Waiting for API design approval before proceeding",
    "addAc": "API design approved by architect",
    "projectPath": "/home/user/projects/awesome-app"
  }
}
```

## Project Reporting

### Generate Status Reports

```json
// List all in-progress tasks
{
  "tool": "list_tasks",
  "params": {
    "status": "in-progress",
    "sort": "priority",
    "projectPath": "/home/user/projects/awesome-app"
  }
}

// List tasks by team member
{
  "tool": "list_tasks",
  "params": {
    "assignee": "frontend-dev",
    "projectPath": "/home/user/projects/awesome-app"
  }
}

// Export current board state
{
  "tool": "export_board",
  "params": {
    "exportVersion": "Weekly Status Report",
    "readme": true,
    "projectPath": "/home/user/projects/awesome-app"
  }
}
```

## Web Interface Integration

### Launch Web UI for Visual Management

```json
// Start the web interface
{
  "tool": "browser",
  "params": {
    "port": 8080,
    "noOpen": false,
    "projectPath": "/home/user/projects/awesome-app"
  }
}
```

## Configuration Management

### Project Setup and Configuration

```json
// Set project configuration
{
  "tool": "config_set",
  "params": {
    "key": "team_size",
    "value": "5",
    "projectPath": "/home/user/projects/awesome-app"
  }
}

// View current configuration
{
  "tool": "config_list",
  "params": {
    "projectPath": "/home/user/projects/awesome-app"
  }
}

// Update agent instructions for AI assistance
{
  "tool": "update_agent_instructions",
  "params": {
    "projectPath": "/home/user/projects/awesome-app"
  }
}
```

## Error Handling Examples

### Handling Common Errors

```json
// Invalid task ID - will return clear error message
{
  "tool": "view_task",
  "params": {
    "id": "non-existent-task",
    "projectPath": "/home/user/projects/awesome-app"
  }
}

// Missing required parameters - will return validation error
{
  "tool": "create_task",
  "params": {
    "description": "This will fail because title is required",
    "projectPath": "/home/user/projects/awesome-app"
  }
}
```

---

## 📖 Next Steps

### Learn More

- [📚 API Reference](API.md) - Deep dive into all available tools and parameters
- [🚀 Developer Guide](../DEVELOPER_GUIDE.md) - Extend functionality with custom tools
- [🤝 Contributing](../CONTRIBUTING.md) - Share your own examples and workflows

### Get Support

- [GitHub Discussions](https://github.com/telco2011/mcp-backlog-md/discussions) - Community support
- [GitHub Issues](https://github.com/telco2011/mcp-backlog-md/issues) - Bug reports and feature requests

These examples demonstrate the flexibility and power of the MCP backlog.md server for managing projects of any size and complexity. The tools can be combined in various ways to create custom workflows that fit your team's specific needs.
