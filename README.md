# MCP Server for Backlog.md

[![CI](https://github.com/telco2011/mcp-backlog-md/workflows/CI/badge.svg)](https://github.com/telco2011/mcp-backlog-md/actions)
[![Coverage](https://img.shields.io/badge/coverage-77.21%25-brightgreen)](https://github.com/telco2011/mcp-backlog-md/actions)
[![Tests](https://img.shields.io/badge/tests-163%20passing-brightgreen)](https://github.com/telco2011/mcp-backlog-md/actions)
[![npm version](https://badge.fury.io/js/mcp-backlog-md.svg)](https://badge.fury.io/js/mcp-backlog-md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project provides a production-ready MCP (Model Context Protocol) server for the [`backlog.md` CLI](https://github.com/MrLesk/Backlog.md) tool. It enables language models to interact seamlessly with `backlog.md` for comprehensive task management, project planning, and team collaboration.

## 📚 Documentation Navigation

| Document                                    | Purpose                          | Audience                   |
| ------------------------------------------- | -------------------------------- | -------------------------- |
| [📖 README.md](README.md)                   | Project overview and quick start | Everyone                   |
| [🚀 DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) | Comprehensive development guide  | Contributors & Maintainers |
| [🧪 Testing Guide](docs/TESTING.md)         | Testing framework and practices  | Developers & Contributors  |
| [📚 API Reference](docs/API.md)             | Complete API documentation       | Developers & Integrators   |
| [📝 Examples](docs/EXAMPLES.md)             | Usage examples and workflows     | Users & Developers         |
| [🤝 Contributing](CONTRIBUTING.md)          | Contribution guidelines          | Contributors               |
| [🔒 Security](SECURITY.md)                  | Security policy and reporting    | Security Researchers       |

## 🚀 Quick Start

### For End Users

1. **Install the server:**

   ```bash
   npm install -g mcp-backlog-md
   # or use with npx (no installation required)
   npx mcp-backlog-md
   ```

2. **Set up your backlog project:**

   ```bash
   npx backlog init
   ```

3. **Configure your MCP client** (VS Code, Cline, etc.) - see [Installation](#installation)

4. **Start managing tasks** - see [Examples](docs/EXAMPLES.md)

### For Developers

Ready to contribute? 🛠️

1. **Quick setup:**

   ```bash
   git clone https://github.com/telco2011/mcp-backlog-md.git
   cd mcp-backlog-md
   npm install
   npm run check-all  # Runs formatting, linting, type checking, and build
   ```

2. **Read the full guide:** [🚀 DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)

3. **Understand the API:** [📚 API Reference](docs/API.md)

### Prerequisites

- Node.js (v18 or higher)
- (Optional) `backlog.md` CLI tool: `npm i -g backlog.md`
- A [Backlog.md initialized project](https://github.com/MrLesk/Backlog.md?tab=readme-ov-file#project-setup)

### Installation

#### VS Code

```json
{
  "servers": {
    "mcp-backlog-md": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "mcp-backlog-md"]
    }
  }
}
```

#### Cline

```json
{
  "mcpServers": {
    "mcp-backlog-md": {
      "command": "npx",
      "args": ["-y", "mcp-backlog-md"],
      "disabled": false,
      "autoApprove": [],
      "timeout": 30
    }
  }
}
```

## Features

### Available MCP Tools

This server provides comprehensive MCP tools that map directly to backlog.md CLI commands:

#### Task Management

- **createTask** - Create new tasks with full option support
- **editTask** - Edit existing tasks with complete CLI parity
- **viewTask** - View task details
- **listTasks** - List tasks with filtering and sorting options
- **archiveTask** - Archive completed tasks (supports bulk operations)
- **demoteTask** - Convert tasks back to drafts

#### Draft Management

- **createDraft** - Create draft tasks for future planning
- **promoteDraft** - Promote drafts to active tasks

#### Documentation & Decisions

- **createDoc** - Create documentation files with type support
- **listDocs** - List all project documentation
- **viewDoc** - View document contents
- **createDecision** - Create architectural decision records

#### Board & Export

- **exportBoard** - Export Kanban board to markdown files
- **browser** - Launch web UI for visual backlog management

#### Project Management

- **configList** - List current project configuration
- **configSet** - Update project settings and preferences
- **cleanup** - Clean up completed tasks and maintain board hygiene
- **updateAgentInstructions** - Update AI agent instruction files

### Enhanced Features

#### 🔒 **Security & Reliability**

- **Command Injection Prevention**: Secure command execution with input sanitization
- **Retry Logic**: Automatic retry with exponential backoff for transient failures
- **Error Recovery**: Robust error handling with detailed context and recovery suggestions
- **Path Validation**: Prevents directory traversal and validates project structure

#### 🚀 **Performance & Quality**

- **Optimized Execution**: Uses `execFile` when possible for better security and performance
- **Comprehensive Testing**: 163 tests with 77.21% coverage and zero tolerance for failures
- **Type Safety**: Full TypeScript implementation with strict type checking
- **Input Validation**: Zod schema validation for all tool parameters

#### 🔧 **Developer Experience**

- **CI/CD Integration**: GitHub Actions workflows with comprehensive quality gates
- **Code Quality**: ESLint, Prettier, and automated code formatting with zero tolerance
- **Testing Framework**: Jest with 163 comprehensive tests and 77.21% coverage
- **API Documentation**: Complete API documentation with testing guides and examples

### Feature Parity

This MCP server provides **complete feature parity** with the original [MrLesk/Backlog.md](https://github.com/MrLesk/Backlog.md) CLI tool, including all command options and flags.

## Usage

### Testing

To manually test the server with a client, you can use the [MCP inspector](https://github.com/modelcontextprotocol/inspector):

```bash
npm run inspector
```

## CI/CD

This project uses GitHub Actions to automate the build, test, and release process.

- **Build and Test:** On every push or pull request to the `main` and `develop` branches, the workflow in `.github/workflows/build.yml` is triggered. It installs dependencies, lints the code, builds the project, and runs the tests.
- **Pull Request Creation:** If a build on the `develop` branch is successful, a pull request is automatically created to merge `develop` into `main`.
- **Release and Publish:** When a push is made to the `main` branch, a new GitHub Release is created with a tag corresponding to the version in `package.json`. This, in turn, triggers the `.github/workflows/publish.yml` workflow to publish the package to the npm registry.

## Development

### Quick Commands

```bash
# Build the project
npm run build

# Run linting
npm run lint

# Format code
npm run format

# Run all checks (format + lint + build)
npm run check-all

# Test with MCP inspector
npm run inspector

# Clean build artifacts
npm run clean
```

### Architecture

The server uses dynamic tool discovery - all `.ts` files in `src/tools/` are automatically loaded and registered. Each tool follows a standard pattern:

- **Schema validation** using Zod
- **Command execution** via centralized `commandExecutor.ts`
- **Error handling** with structured responses

## 🤝 Contributing

We welcome contributions from developers of all skill levels! This project follows enterprise-grade development practices with comprehensive testing, security, and quality standards.

**Get Started:**

1. 📖 Read our [Contributing Guide](CONTRIBUTING.md) for the complete process
2. 🚀 Follow the [Developer Guide](DEVELOPER_GUIDE.md) for technical setup
3. 🔒 Review our [Security Policy](SECURITY.md) for security-related contributions

**What we're looking for:**

- 🐛 Bug fixes and improvements
- ✨ New MCP tool implementations
- 📚 Documentation enhancements
- 🧪 Test coverage improvements
- 🔒 Security enhancements

**Development Standards:**

- **Code Quality**: ESLint, Prettier, TypeScript strict mode with zero tolerance
- **Testing**: Jest with 163 tests, 77.21% coverage, zero failures allowed
- **Security**: Automated security auditing and vulnerability scanning
- **CI/CD**: Comprehensive quality gates, automated testing, and deployment
- **Documentation**: Complete API docs, testing guides, and practical examples

## Quality Assurance

This project maintains enterprise-grade quality standards:

- **Comprehensive Testing**: 163 tests with 77.21% coverage and zero tolerance for failures
- **Code Quality**: ESLint, Prettier, TypeScript strict mode with automated enforcement
- **Security**: Regular security audits, vulnerability scanning, and automated dependency updates
- **CI/CD**: Multi-stage pipelines with quality gates, coverage reporting, and automated releases
- **Documentation**: Complete documentation suite including testing guides and security practices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📖 Documentation Index

**Getting Started:**

- [🚀 Quick Start](#-quick-start) - Get up and running fast
- [⚙️ Installation](#installation) - Detailed setup instructions
- [✨ Features](#features) - What this server can do

**For Users:**

- [📝 Usage Examples](docs/EXAMPLES.md) - Practical workflows and patterns
- [📚 API Reference](docs/API.md) - Complete tool documentation

**For Contributors:**

- [🚀 Developer Guide](DEVELOPER_GUIDE.md) - Comprehensive development setup
- [🧪 Testing Guide](docs/TESTING.md) - Testing framework and best practices
- [🤝 Contributing](CONTRIBUTING.md) - How to contribute to the project
- [🔒 Security Policy](SECURITY.md) - Security guidelines and reporting

**For Maintainers:**

- [🏗️ Claude Instructions](CLAUDE.md) - AI assistant development guide

---

<div align="center">
<p>Built with ❤️ for the backlog.md community</p>
<p><a href="https://github.com/MrLesk/Backlog.md">Original backlog.md CLI</a> | <a href="https://github.com/telco2011/mcp-backlog-md">This MCP Server</a></p>
</div>
