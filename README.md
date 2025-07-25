# MCP Server for Backlog.md

This project provides an MCP (Model Context Protocol) server for the [`backlog.md` CLI](https://github.com/MrLesk/Backlog.md) tool. It allows language models to interact with `backlog.md` to manage tasks, boards, and other project artifacts.

## Getting Started

### Prerequisites

- Node.js
- (Optional) This MCP Server uses `npx` but you can install `backlog.md` CLI tool globally (`npm i -g backlog.md`)

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

## Configuration

The server can be configured using the following environment variable:

- `BACKLOG_REPO_PATH`: The absolute path to the repository where the `backlog` directory is located. If not set, it defaults to the current working directory.

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

For detailed information on the project structure, development workflow, and how to contribute, please see the [Developer Guide](DEVELOPER_GUIDE.md).
