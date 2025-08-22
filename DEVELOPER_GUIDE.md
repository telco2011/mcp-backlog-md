# 🚀 Developer Guide

Welcome to the MCP backlog.md server development guide! This comprehensive guide will help you contribute to this production-ready MCP server with enterprise-grade standards for code quality, security, and reliability.

## 📋 Table of Contents

1. [🛠️ Development Setup](#️-development-setup)
2. [🏗️ Project Architecture](#️-project-architecture) 
3. [🔧 Development Workflow](#-development-workflow)
4. [🧪 Testing Guidelines](#-testing-guidelines)
5. [🔒 Security Considerations](#-security-considerations)
6. [📝 Code Quality Standards](#-code-quality-standards)
7. [🚀 CI/CD Pipeline](#-cicd-pipeline)
8. [🔍 Debugging & Troubleshooting](#-debugging--troubleshooting)
9. [📚 API Development Guide](#-api-development-guide)

## 🛠️ Development Setup

### Prerequisites

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)
- **(Optional)** `backlog.md` CLI tool: `npm i -g backlog.md`

### Quick Setup

1. **Clone and setup:**
   ```bash
   git clone https://github.com/telco2011/mcp-backlog-md.git
   cd mcp-backlog-md
   npm install
   ```

2. **Run quality checks:**
   ```bash
   npm run check-all  # Runs formatting, linting, type checking, and build
   ```

3. **Start developing:**
   ```bash
   npm run build      # Build the project
   npm run test       # Run tests
   npm run lint:fix   # Fix linting issues
   ```

### Development Scripts

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `npm run build` | Compile TypeScript to JavaScript | Before testing or deployment |
| `npm run dev` | Watch mode for development | During active development |
| `npm run test` | Run test suite | Before committing changes |
| `npm run test:watch` | Run tests in watch mode | During TDD development |
| `npm run test:coverage` | Generate coverage report | Before PRs, checking test completeness |
| `npm run lint` | Check for linting issues | Before committing |
| `npm run lint:fix` | Auto-fix linting issues | When cleaning up code |
| `npm run format` | Format code with Prettier | Before committing |
| `npm run format:check` | Check if code is formatted | In CI/CD pipeline |
| `npm run typecheck` | Check TypeScript types | Before committing |
| `npm run check-all` | Run all quality checks | Before committing, in CI |
| `npm run inspector` | Launch MCP inspector | For manual testing |

## 🏗️ Project Architecture

### Directory Structure

```
mcp-backlog-md/
├── 📁 src/                          # TypeScript source code
│   ├── 📁 lib/                      # Core library modules
│   │   ├── backlogMCPServer.ts      # Main MCP server class
│   │   ├── commandExecutor.ts       # Secure command execution with retry logic
│   │   ├── errors.ts                # Custom error classes
│   │   ├── schemas.ts               # Reusable Zod validation schemas
│   │   ├── types.ts                 # TypeScript type definitions
│   │   └── utils.ts                 # Utility functions and constants
│   ├── 📁 tools/                    # MCP tool implementations
│   │   ├── createTask.ts            # Task creation tool
│   │   ├── editTask.ts              # Task editing tool
│   │   └── ...                      # 18 total tools
│   └── server.ts                    # Application entry point
├── 📁 docs/                         # Project documentation
│   ├── API.md                       # Complete API reference
│   └── EXAMPLES.md                  # Usage examples and workflows
├── 📁 .github/                      # GitHub configuration
│   └── 📁 workflows/                # CI/CD automation
│       ├── ci.yml                   # Continuous Integration
│       ├── release.yml              # Automated releases
│       └── pr-automation.yml        # PR automation
├── 📁 build/                        # Compiled JavaScript (generated)
├── 📁 backlog/                      # Sample backlog.md project data
└── 📄 Configuration files           # package.json, tsconfig.json, etc.
```

### Core Architecture Patterns

#### 🔧 **Dynamic Tool Discovery**
- Tools are automatically discovered and registered from `src/tools/`
- Each tool follows the `McpTool` interface contract
- Zero-configuration tool registration

#### 🛡️ **Layered Security**
- **Input Validation**: Zod schema validation for all parameters
- **Command Sanitization**: Input sanitization to prevent injection attacks
- **Secure Execution**: `execFile` used when possible instead of `exec`
- **Path Validation**: Project path validation to prevent directory traversal

#### 🔄 **Robust Error Handling**
- **Custom Error Classes**: `CliError`, `SystemError` for categorized errors
- **Retry Logic**: Exponential backoff for transient failures
- **Error Context**: Detailed error context preservation
- **Graceful Degradation**: Fallback mechanisms for critical operations

#### 📊 **Centralized Command Execution**
- **Single Responsibility**: All CLI interactions go through `commandExecutor.ts`
- **Consistent Logging**: Structured logging for debugging and monitoring
- **Response Standardization**: Uniform response format across all tools

## 🔧 Development Workflow

### Standard Development Process

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. **Make your changes** following our coding standards

3. **Run quality checks:**
   ```bash
   npm run check-all    # Must pass before committing
   npm run test         # Ensure tests pass
   ```

4. **Commit with conventional commits:**
   ```bash
   git commit -m "feat: add new MCP tool for task scheduling"
   ```

5. **Push and create PR:**
   ```bash
   git push origin feature/my-new-feature
   # Create PR through GitHub interface
   ```

### Adding a New MCP Tool

Our plugin architecture makes adding tools straightforward:

#### 1. Create Tool File
```bash
# Create new tool file
touch src/tools/myNewTool.ts
```

#### 2. Implement Tool Interface
```typescript
import * as changeCase from 'change-case';
import { z } from 'zod';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { executeCommand } from '../lib/commandExecutor.js';
import { withProjectPath } from '../lib/schemas.js';
import { backlogCommand } from '../lib/utils.js';

const name = 'myNewTool';

// Define input schema with validation
const schema = {
  requiredParam: z.string().describe('Description for required parameter'),
  optionalParam: z.string().optional().describe('Optional parameter'),
  ...withProjectPath.shape, // Always include project path
};

const zSchema = z.object(schema);

// Implement the tool execution logic
async function execute(params: z.infer<typeof zSchema>): Promise<CallToolResult> {
  console.info('Executing myNewTool', params);
  
  const command = `${backlogCommand} my-command "${params.requiredParam}"`;
  if (params.optionalParam) {
    command += ` --optional "${params.optionalParam}"`;
  }

  return executeCommand({
    command,
    successMessage: 'My tool executed successfully',
    projectPath: params.projectPath,
    retries: 3, // Optional: customize retry behavior
  });
}

// Export tool definition
export default {
  definition: {
    name,
    title: changeCase.capitalCase(name),
    description: 'Brief description of what this tool does',
    inputSchema: schema,
  },
  execute,
};
```

#### 3. Test Your Tool
```bash
npm run build
npm run inspector  # Use MCP inspector to test manually
npm run test       # Run automated tests
```

#### 4. Security Checklist
- ✅ All inputs validated with Zod schemas
- ✅ No direct user input in shell commands
- ✅ Uses `executeCommand` for CLI interactions
- ✅ Proper error handling implemented
- ✅ Logging for debugging included

The server automatically discovers and registers your new tool!

### Running the Server

#### Development Mode
```bash
npm run build       # Compile TypeScript
npm run inspector   # Launch MCP inspector for testing
```

#### Production Mode
```bash
npm run build
npm start          # Run compiled server
```

#### Debug Mode
```bash
DEBUG=* npm run build && DEBUG=* node build/src/server.js
```

## 🧪 Testing Guidelines

### Test Requirements

All code contributions must include tests with **>70% coverage**. Our testing strategy includes:

#### Unit Tests
```typescript
// Example: src/tools/__tests__/createTask.test.ts
import { jest } from '@jest/globals';
import createTask from '../createTask';

// Mock the command executor
jest.mock('../lib/commandExecutor', () => ({
  executeCommand: jest.fn(),
}));

describe('createTask tool', () => {
  it('should create a task with valid parameters', async () => {
    const mockExecuteCommand = jest.mocked(executeCommand);
    mockExecuteCommand.mockResolvedValue({
      content: [{ type: 'text', text: 'Task created successfully' }],
    });

    const result = await createTask.execute({
      title: 'Test Task',
      projectPath: '/test/path',
    });

    expect(mockExecuteCommand).toHaveBeenCalledWith({
      command: expect.stringContaining('npx backlog task create "Test Task"'),
      successMessage: 'Task created successfully',
      projectPath: '/test/path',
    });
  });
});
```

#### Integration Tests
Test complete MCP workflows end-to-end with the backlog.md CLI.

#### Running Tests
```bash
npm run test              # Run all tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Generate coverage report
npm run test -- --verbose # Run tests with detailed output
```

### Test Patterns

- **Mock External Dependencies**: Always mock `executeCommand` and file system operations
- **Test Error Scenarios**: Include tests for validation errors and command failures
- **Test Input Validation**: Verify Zod schema validation works correctly
- **Snapshot Testing**: Use for stable command output verification

## 🔒 Security Considerations

### Input Validation
- **Always use Zod schemas** for parameter validation
- **Sanitize user inputs** to prevent command injection
- **Validate file paths** to prevent directory traversal

### Command Execution
- **Use `executeCommand` exclusively** - never call `exec` directly
- **Quote user parameters** in shell commands
- **Avoid concatenating user input** into shell commands

### Security Checklist for New Tools
- [ ] All parameters validated with Zod schemas
- [ ] User inputs are sanitized before command construction
- [ ] File paths are validated against project boundaries
- [ ] Sensitive data (if any) is not logged
- [ ] Error messages don't expose system information

### Vulnerability Reporting
See our [Security Policy](SECURITY.md) for reporting security vulnerabilities.

## 📝 Code Quality Standards

### TypeScript Configuration
- **Strict mode enabled** - no `any` types without justification
- **Explicit return types** for exported functions
- **Proper error handling** with custom error classes

### Linting and Formatting
```bash
npm run lint              # Check for issues
npm run lint:fix          # Auto-fix issues
npm run format            # Format code
npm run typecheck         # Check types
```

### Code Style Guidelines

#### Import Organization
```typescript
// 1. Node.js built-ins
import { readFile } from 'fs/promises';

// 2. External packages
import { z } from 'zod';
import * as changeCase from 'change-case';

// 3. Internal modules (relative imports last)
import { executeCommand } from '../lib/commandExecutor.js';
import { withProjectPath } from '../lib/schemas.js';
```

#### Error Handling Patterns
```typescript
try {
  const result = await executeCommand(options);
  return result;
} catch (error) {
  // Log with context
  console.error({ error, toolName: 'myTool' }, 'Tool execution failed');
  
  // Re-throw with additional context if needed
  throw error;
}
```

#### Naming Conventions
- **Files**: camelCase (e.g., `createTask.ts`)
- **Functions**: camelCase (e.g., `executeCommand`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `DEFAULT_RETRY_CONFIG`)
- **Types/Interfaces**: PascalCase (e.g., `McpTool`)

## 🚀 CI/CD Pipeline

Our automated pipeline ensures code quality and security:

### Continuous Integration (`.github/workflows/ci.yml`)
- **Multi-Node Testing**: Tests on Node.js 18, 20, and 22
- **Code Quality**: ESLint, Prettier, TypeScript checks
- **Security Scanning**: `npm audit` and vulnerability checks
- **Build Verification**: Ensures clean compilation
- **Coverage Reporting**: Uploads to Codecov

### Release Automation (`.github/workflows/release.yml`)
- **Automated Releases**: GitHub releases with changelogs
- **NPM Publishing**: Automatic package publishing
- **Version Management**: Based on `package.json` version

### PR Automation (`.github/workflows/pr-automation.yml`)
- **Auto-PR Creation**: From develop to main branch
- **PR Validation**: Runs full test suite on PRs
- **Status Comments**: Automated success/failure notifications

### Branch Strategy
- **`main`**: Production-ready code
- **`develop`**: Integration branch for features
- **`feature/*`**: Feature development branches
- **`fix/*`**: Bug fix branches

## 🔍 Debugging & Troubleshooting

### Common Issues

#### `backlog: command not found`
```bash
# Install backlog.md CLI globally
npm i -g backlog.md

# Or check if it's in PATH
which backlog
```

#### Tool Not Appearing in MCP Client
1. Check build completed successfully: `npm run build`
2. Verify tool file exports default object correctly
3. Check server logs for registration errors
4. Validate tool follows `McpTool` interface

#### Validation Errors
1. Check Zod schema matches expected parameters
2. Verify parameter types in tool definition
3. Use MCP inspector to test parameter combinations

#### Command Execution Failures
```bash
# Enable debug logging
DEBUG=* node build/src/server.js

# Check specific tool execution
npm run inspector  # Use MCP inspector to test manually
```

### Debugging Tools

#### MCP Inspector
```bash
npm run inspector
# Opens web interface for testing tools manually
```

#### Verbose Logging
```typescript
// Add detailed logging in tools
console.info({ params, command }, 'Tool execution details');
```

#### TypeScript Debugging
```bash
# Check for type errors
npm run typecheck

# Get detailed type information
npx tsc --noEmit --listFiles
```

## 📚 API Development Guide

### Tool Interface Contract

Every MCP tool must implement the `McpTool` interface:

```typescript
interface McpTool {
  definition: {
    name: string;
    title?: string;
    description: string;
    inputSchema: ZodRawShape;
  };
  execute: ToolCallback<ZodRawShape>;
}
```

### Parameter Best Practices

#### Required vs Optional Parameters
```typescript
const schema = {
  // Required parameters
  id: z.string().describe('Task ID to edit'),
  
  // Optional parameters with sensible defaults
  priority: z.string().optional().describe('Priority (high, medium, low)'),
  
  // Boolean flags
  draft: z.boolean().optional().describe('Create as draft'),
  
  // Always include project path
  ...withProjectPath.shape,
};
```

#### Input Validation Patterns
```typescript
// String with constraints
title: z.string().min(1, 'Title cannot be empty').describe('Task title'),

// Enum validation
priority: z.enum(['high', 'medium', 'low']).optional(),

// Custom validation
email: z.string().email('Invalid email format').optional(),
```

### Response Format Standards

All tools should return consistent response format:

```typescript
return {
  content: [
    {
      type: 'text',
      text: result.trim(),
      _meta: {
        successMessage: 'Operation completed successfully'
      }
    }
  ]
};
```

### Error Handling Standards

Use appropriate error types:
- `CliError`: For backlog.md CLI tool errors
- `SystemError`: For system-level errors (file not found, permissions, etc.)
- Generic `Error`: For validation and logic errors

### Documentation Requirements

Each tool should include:
- Clear parameter descriptions
- Usage examples in JSDoc comments
- Error scenarios and handling
- Integration with overall API documentation

---

## 📖 Additional Resources

- [📚 API Reference](docs/API.md) - Complete tool documentation
- [📝 Usage Examples](docs/EXAMPLES.md) - Practical implementation examples
- [🤝 Contributing Guidelines](CONTRIBUTING.md) - How to contribute
- [🔒 Security Policy](SECURITY.md) - Security guidelines and reporting
- [Original backlog.md CLI](https://github.com/MrLesk/Backlog.md) - Upstream project

---

<div align="center">
<p><strong>Happy coding! 🚀</strong></p>
<p>Questions? Check our <a href="https://github.com/telco2011/mcp-backlog-md/discussions">GitHub Discussions</a></p>
</div>
