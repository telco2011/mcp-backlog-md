# 🏗️ Claude Instructions

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository. These instructions help maintain consistency and quality when AI assistants work on the MCP Backlog.md Server project.

## 📚 Documentation Navigation

This project has a comprehensive documentation structure:

- **[README.md](README.md)** - Project overview, quick start, and navigation hub
- **[DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)** - Comprehensive development guide with all modern practices
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Detailed contribution guidelines and standards
- **[SECURITY.md](SECURITY.md)** - Security policy, vulnerability reporting, and best practices
- **[docs/API.md](docs/API.md)** - Complete API reference for all MCP tools
- **[docs/EXAMPLES.md](docs/EXAMPLES.md)** - Practical usage examples and workflows

## Project Overview

This is an MCP (Model Context Protocol) server for the `backlog.md` CLI tool. It provides tools to manage tasks, boards, and project artifacts through an MCP interface.

## 🚀 Development Commands

### Essential Commands

- **Build**: `npm run build` - Compiles TypeScript with executable permissions
- **Quality Check**: `npm run check-all` - Runs format, lint, typecheck, and build
- **Test**: `npm run test` - Runs Jest test suite (163 tests)
- **Test Coverage**: `npm run test:coverage` - Generates coverage report (77.21% coverage)
- **MCP Inspector**: `npm run inspector` - Launches MCP inspector for manual testing

### Quality Assurance Commands

- **Lint**: `npm run lint` / `npm run lint:fix` - ESLint with auto-fix
- **Format**: `npm run format` / `npm run format:check` - Prettier formatting
- **Type Check**: `npm run typecheck` - TypeScript type validation
- **Test Watch**: `npm run test:watch` - Run tests in watch mode for TDD

### Testing Framework

Our comprehensive testing framework maintains **163 passing tests with 77.21% coverage**:

- **Mock Infrastructure**: Complete mocking system avoiding external CLI dependencies
- **Coverage Requirements**: 70% minimum across statements, branches, functions, and lines
- **Zero Tolerance**: All tests must pass - no failures allowed in CI/CD
- **Test Categories**: Unit tests for all 18 tools, core library functions, and error handling

### Utility Commands

- **Clean**: `npm run clean` - Remove build directory
- **Start**: `npm run start` - Run the compiled server
- **Development**: `npm run dev` - Watch mode for development

## 🏗️ Architecture

### Core Components

- **`src/server.ts`**: Main entry point that initializes `BacklogMCPServer`
- **`src/lib/backlogMCPServer.ts`**: Core server class with dynamic tool discovery
- **`src/lib/commandExecutor.ts`**: **Enhanced** secure command execution with retry logic and sanitization
- **`src/lib/errors.ts`**: Custom error classes (`CliError`, `SystemError`, `McpError`)
- **`src/lib/schemas.ts`**: Reusable Zod validation schemas
- **`src/lib/types.ts`**: TypeScript interfaces including `McpTool`
- **`src/lib/utils.ts`**: Utility constants and helper functions
- **`src/tools/`**: 18+ MCP tools, each with validation, execution, and error handling

### Enhanced Features (v1.2+)

- **🔒 Security**: Command injection prevention, input sanitization, path validation
- **🔄 Reliability**: Retry logic with exponential backoff, structured error handling
- **🧪 Testing**: Jest configuration, mocking strategies, coverage requirements (>70%)
- **🚀 CI/CD**: GitHub Actions for testing, security scanning, automated releases
- **📚 Documentation**: Comprehensive API docs, usage examples, security guidelines

### Tool System

The server uses dynamic tool discovery - all `.ts` files in `src/tools/` are automatically loaded and registered. Each tool must export:

- `definition`: Object with `name`, `description`, and `inputSchema` (Zod schema)
- `execute`: Async function that takes validated parameters and returns results

Tools interact with the `backlog.md` CLI using `executeCommand()` from `commandExecutor.ts`.

### Data Structure

- **`backlog/`**: Contains the backlog.md project data
  - `config.yml`: Project configuration
  - `tasks/`: Active tasks
  - `completed/`: Completed tasks
  - `archive/`: Archived tasks and drafts
  - `docs/`: Project documentation
  - `decisions/`: Decision records

## Key Dependencies

- `@modelcontextprotocol/sdk`: MCP server framework
- `zod`: Schema validation for tool inputs
- `change-case`: String case transformations

## Build Process

TypeScript compilation creates executable JavaScript in `build/` with proper shebang for CLI usage. The build process ensures `build/src/server.js` has executable permissions.

## 🎯 Development Standards

This project follows **enterprise-grade development practices**:

### Code Quality Requirements

- **TypeScript Strict Mode**: No `any` types without justification
- **ESLint + Prettier**: Automated code formatting and quality checks
- **Test Coverage**: >70% coverage requirement with Jest (currently 77.21%)
- **Security**: Input validation, command injection prevention, vulnerability scanning
- **Documentation**: Complete API docs, usage examples, security guidelines
- **CI/CD Pipeline**: Automated testing, quality gates, and security scanning

### Development Workflow

- **Git Flow**: Feature branches, conventional commits, automated PR validation
- **CI/CD**: GitHub Actions with comprehensive quality gates and automated releases
- **Code Review**: Required PR reviews with automated coverage reporting
- **Quality Gates**: All checks must pass before merge (`npm run check-all`, `npm run test:coverage`)
- **Testing**: 163 tests must pass with 77.21% coverage minimum

### Security Standards

- **Input Validation**: Zod schemas for all tool parameters
- **Command Safety**: Secure execution with `execFile` and input sanitization
- **Path Validation**: Prevent directory traversal attacks
- **Error Handling**: No sensitive information in error messages
- **Vulnerability Scanning**: Regular dependency audits and automated updates

### Global Development Rules

This project follows global development standards defined in the Claude Code global configuration:

- **Global Rules Directory**: `~/.claude/global-rules/`
- **Configuration**: `~/.claude/config.yml`

The following global rules are automatically applied:

1. **General Rules** (`~/.claude/global-rules/general.md`): Universal workflow, Git Flow, commit standards, documentation requirements, and code quality practices
2. **Backend Rules** (`~/.claude/global-rules/backend.md`): SOLID principles, Clean Architecture, testing requirements, error handling, database practices, and security standards
3. **Frontend Rules** (`~/.claude/global-rules/frontend.md`): Component architecture, state management, performance optimization, accessibility, and testing practices

These global rules take precedence and are merged with project-specific requirements. All development work must adhere to these standards in addition to the project-specific guidelines above.

## 🚨 Important Instructions for Claude Code

### File Management

- **Prefer editing over creating**: Always edit existing files rather than creating new ones
- **Documentation exceptions**: This project has comprehensive documentation that should be maintained and updated as needed
- **Security first**: Always consider security implications when making code changes
- **Testing required**: New functionality requires corresponding tests

### Code Changes

- **Follow established patterns**: Use existing tool implementations as templates
- **Validate inputs**: All user inputs must be validated with Zod schemas
- **Secure execution**: Use `executeCommand` for all CLI interactions, never direct `exec`
- **Error handling**: Use custom error classes (`CliError`, `SystemError`)
- **Logging**: Include appropriate console logging for debugging

### Quality Standards

- **Run checks**: Always run `npm run check-all` and `npm run test:coverage` before considering changes complete
- **Test coverage**: Maintain >70% test coverage for new code (currently 77.21%)
- **Zero failures**: All 163 tests must pass - no failures allowed
- **Documentation**: Update relevant documentation when adding features
- **Security review**: Consider security implications of all changes
- **CI/CD compliance**: Ensure all GitHub Actions workflows pass

### Project-Specific Guidance

- **Tool discovery**: New tools in `src/tools/` are automatically discovered
- **MCP standards**: Follow MCP protocol standards for tool definitions
- **Backlog.md CLI**: Understand that this server wraps the `backlog.md` CLI tool
- **Path validation**: Always validate and sanitize file paths

## 📚 Quick Reference Links

When working on this project, frequently reference:

- **[DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)** - Comprehensive development guide
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution standards and processes
- **[SECURITY.md](SECURITY.md)** - Security requirements and best practices
- **[docs/API.md](docs/API.md)** - Complete API documentation
- **[docs/EXAMPLES.md](docs/EXAMPLES.md)** - Usage patterns and examples
