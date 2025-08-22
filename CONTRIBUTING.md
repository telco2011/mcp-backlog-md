# 🤝 Contributing to MCP Backlog.md Server

We welcome contributions from developers of all experience levels! This project follows enterprise-grade development practices to ensure code quality, security, and maintainability.

## 🚀 Quick Start for Contributors

1. **Fork and Clone**

   ```bash
   git clone https://github.com/YOUR_USERNAME/mcp-backlog-md.git
   cd mcp-backlog-md
   ```

2. **Set Up Development Environment**

   ```bash
   npm install
   npm run check-all  # Ensure everything works
   ```

3. **Read the Documentation**
   - [🚀 Developer Guide](DEVELOPER_GUIDE.md) - Comprehensive development setup
   - [📚 API Reference](docs/API.md) - Complete API documentation
   - [🔒 Security Policy](SECURITY.md) - Security guidelines

## 📋 How to Contribute

### 1. Find Something to Work On

**Good First Issues:**

- Look for issues labeled `good first issue` or `help wanted`
- Documentation improvements
- Adding tests to existing tools
- Small bug fixes

**For Experienced Contributors:**

- New MCP tool implementations
- Performance optimizations
- Security enhancements
- Complex bug fixes

### 2. Follow Our Development Process

#### Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

#### Make Your Changes

- Follow our [Code Quality Standards](#-code-quality-standards)
- Add tests for new functionality
- Update documentation if needed
- Follow security best practices

#### Test Your Changes

```bash
npm run check-all     # Run all quality checks
npm run test         # Run test suite
npm run inspector    # Manual testing with MCP inspector
```

#### Commit with Conventional Commits

We use [Conventional Commits](https://www.conventionalcommits.org/) for clear commit messages:

```bash
git commit -m "feat: add new task scheduling tool"
git commit -m "fix: resolve command injection vulnerability"
git commit -m "docs: update API documentation for createTask"
git commit -m "test: add unit tests for editTask tool"
```

**Types:**

- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `test`: Adding or updating tests
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `chore`: Maintenance tasks

#### Submit Your Pull Request

1. Push your branch: `git push origin feature/your-feature-name`
2. Create a PR through GitHub's interface
3. Fill out the PR template completely
4. Link related issues with "Fixes #123" or "Closes #123"

## 🔍 Code Quality Standards

### Required Quality Checks

All contributions must pass these automated checks:

```bash
npm run format        # Code formatting with Prettier
npm run lint          # ESLint code quality checks
npm run typecheck     # TypeScript type checking
npm run test          # Test suite (>70% coverage required)
npm run build         # Successful compilation
```

### Code Style Guidelines

#### TypeScript Standards

- **Strict mode enabled** - avoid `any` types
- **Explicit return types** for public functions
- **Proper error handling** with custom error classes
- **Input validation** with Zod schemas

#### File Organization

```typescript
// 1. Node.js built-ins
// 2. External packages (alphabetical)
import * as changeCase from 'change-case';
import { readFile } from 'fs/promises';
import { z } from 'zod';

// 3. Internal modules (relative imports last)
import { executeCommand } from '../lib/commandExecutor.js';
import { withProjectPath } from '../lib/schemas.js';
```

#### Naming Conventions

- **Files**: `camelCase.ts` (e.g., `createTask.ts`)
- **Functions**: `camelCase()` (e.g., `executeCommand()`)
- **Constants**: `SCREAMING_SNAKE_CASE` (e.g., `DEFAULT_RETRY_CONFIG`)
- **Types/Interfaces**: `PascalCase` (e.g., `McpTool`)

### Testing Requirements

#### Test Coverage

- **Minimum 70% coverage** for all new code
- **Unit tests** for all new tools and functions
- **Integration tests** for complete workflows
- **Error scenario testing** for edge cases

#### Test Structure

```typescript
// src/tools/__tests__/myTool.test.ts
import { jest } from '@jest/globals';

import myTool from '../myTool';

// Mock external dependencies
jest.mock('../lib/commandExecutor');

describe('myTool', () => {
  it('should handle valid input correctly', () => {
    // Test implementation
  });

  it('should handle validation errors', () => {
    // Test error scenarios
  });
});
```

## 🔒 Security Requirements

### Security Checklist for All Contributions

- [ ] **Input Validation**: All parameters validated with Zod schemas
- [ ] **Command Safety**: No direct user input in shell commands
- [ ] **Path Validation**: File paths validated against project boundaries
- [ ] **Sanitization**: User inputs sanitized to prevent injection
- [ ] **Error Handling**: Error messages don't expose sensitive information
- [ ] **Logging**: No sensitive data logged to console

### Security Review Process

1. All PRs undergo automated security scanning
2. Security-related changes require additional review
3. Report security vulnerabilities via our [Security Policy](SECURITY.md)

## 🏗️ Adding New MCP Tools

### Tool Development Checklist

#### 1. Plan Your Tool

- [ ] Define clear purpose and scope
- [ ] Identify required and optional parameters
- [ ] Consider error scenarios and edge cases
- [ ] Check if similar functionality exists

#### 2. Implement the Tool

```typescript
// src/tools/myNewTool.ts
import * as changeCase from 'change-case';
import { z } from 'zod';

import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

import { executeCommand } from '../lib/commandExecutor.js';
import { withProjectPath } from '../lib/schemas.js';
import { backlogCommand } from '../lib/utils.js';

const name = 'myNewTool';

const schema = {
  // Define parameters with validation
  requiredParam: z.string().describe('Description of required parameter'),
  optionalParam: z.string().optional().describe('Description of optional parameter'),
  ...withProjectPath.shape,
};

const zSchema = z.object(schema);

async function execute(params: z.infer<typeof zSchema>): Promise<CallToolResult> {
  console.info('Executing myNewTool', params);

  // Build command safely
  const command = `${backlogCommand} my-command "${params.requiredParam}"`;
  if (params.optionalParam) {
    command += ` --optional "${params.optionalParam}"`;
  }

  // Execute with retry logic and error handling
  return executeCommand({
    command,
    successMessage: 'Tool executed successfully',
    projectPath: params.projectPath,
  });
}

export default {
  definition: {
    name,
    title: changeCase.capitalCase(name),
    description: 'Brief description of tool functionality',
    inputSchema: schema,
  },
  execute,
};
```

#### 3. Add Tests

```typescript
// src/tools/__tests__/myNewTool.test.ts
import { jest } from '@jest/globals';

import myNewTool from '../myNewTool';

// Mock dependencies
jest.mock('../lib/commandExecutor');

describe('myNewTool', () => {
  it('should execute successfully with valid parameters', async () => {
    // Test implementation
  });

  it('should validate required parameters', async () => {
    // Test parameter validation
  });

  it('should handle command execution errors', async () => {
    // Test error scenarios
  });
});
```

#### 4. Update Documentation

- [ ] Add tool to [API documentation](docs/API.md)
- [ ] Include usage examples in [EXAMPLES.md](docs/EXAMPLES.md)
- [ ] Update README if needed

## 📝 Documentation Contributions

### Documentation Standards

#### Writing Style

- **Clear and concise** - avoid jargon and complex sentences
- **Action-oriented** - use active voice and imperative mood
- **Examples included** - provide practical code examples
- **Up-to-date** - ensure examples work with current codebase

#### Documentation Types

**API Documentation (`docs/API.md`)**

- Complete parameter descriptions
- Request/response examples
- Error scenarios
- Cross-references to related tools

**Usage Examples (`docs/EXAMPLES.md`)**

- Real-world scenarios
- Complete workflows
- Best practices
- Common patterns

**Developer Documentation**

- Architecture decisions
- Development workflows
- Testing strategies
- Deployment procedures

## 🐛 Bug Reports and Feature Requests

### Reporting Bugs

**Use our issue template and include:**

- **Environment**: Node.js version, OS, MCP client
- **Steps to reproduce** with specific commands/parameters
- **Expected vs actual behavior**
- **Error messages** and stack traces
- **Additional context** that might be relevant

### Feature Requests

**Describe:**

- **Problem**: What issue would this solve?
- **Proposed solution**: How should it work?
- **Alternatives considered**: What other solutions did you consider?
- **Implementation ideas**: Technical approach (if applicable)

## 👥 Code of Conduct

### Our Standards

**Positive behaviors:**

- Using inclusive language
- Respecting different viewpoints and experiences
- Accepting constructive criticism gracefully
- Focusing on what's best for the community
- Showing empathy toward other community members

**Unacceptable behaviors:**

- Harassment or discriminatory language
- Trolling, insulting, or derogatory comments
- Public or private harassment
- Publishing private information without permission
- Other conduct inappropriate in a professional setting

### Enforcement

Violations may result in:

1. Warning with explanation
2. Temporary suspension from project participation
3. Permanent ban from the project

Report violations to project maintainers.

## ⚡ Development Tools and Resources

### Useful Commands

```bash
# Development workflow
npm run dev           # Watch mode development
npm run inspector     # Test tools manually
npm run check-all     # Pre-commit checks

# Debugging
DEBUG=* npm start     # Verbose logging
npm run typecheck     # Check TypeScript errors
npm run test -- --verbose  # Detailed test output

# Quality assurance
npm audit             # Security vulnerability check
npm run test:coverage # Generate coverage report
```

### Recommended Tools

- **VS Code** with TypeScript and ESLint extensions
- **Postman** or similar for API testing
- **Git hooks** for automated quality checks
- **GitHub CLI** for efficient PR management

### Learning Resources

- [MCP Protocol Documentation](https://modelcontextprotocol.io/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zod Documentation](https://zod.dev/)
- [Jest Testing Framework](https://jestjs.io/)

## 🏆 Recognition

### Contributors

We recognize all contributors in:

- **README.md** contributor section
- **GitHub releases** with contributor highlights
- **Project discussions** for significant contributions

### Types of Contributions We Value

- 💻 **Code contributions** (features, fixes, improvements)
- 📝 **Documentation** (guides, examples, API docs)
- 🐛 **Bug reports** (detailed, reproducible issues)
- 💡 **Feature ideas** (thoughtful enhancement suggestions)
- 🧪 **Testing** (expanding test coverage, finding edge cases)
- 📢 **Community** (helping others, discussions, feedback)

## 📞 Getting Help

**Questions about contributing?**

- 💬 [GitHub Discussions](https://github.com/telco2011/mcp-backlog-md/discussions)
- 🐛 [GitHub Issues](https://github.com/telco2011/mcp-backlog-md/issues)
- 📖 [Developer Guide](DEVELOPER_GUIDE.md)

**Need help getting started?**
Look for issues labeled `good first issue` - these are specifically chosen to be approachable for new contributors.

---

<div align="center">
<h2>Thank you for contributing! 🎉</h2>
<p>Your contributions make this project better for everyone in the backlog.md community.</p>
</div>
