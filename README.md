# MCP Server for Backlog.md

This project provides an MCP (Model Context Protocol) server for the `backlog.md` CLI tool. It allows language models to interact with `backlog.md` to manage tasks, boards, and other project artifacts.

## Getting Started

### Prerequisites

- Node.js
- `backlog.md` CLI tool installed globally (`npm i -g backlog.md`)

### Installation

1. Clone the repository.
2. Install dependencies: `npm install`
3. Build the server: `npm run build`

## Usage

### Testing

To run the tests, use the following command:

```bash
npm test
```

The [MCP inspector](https://github.com/modelcontextprotocol/inspector) will be started. Once the inspector is running and configured in your MCP client, you can use the exposed tools to interact with `backlog.md`.

## Development

For detailed information on the project structure, development workflow, and how to contribute, please see the [Developer Guide](DEVELOPER_GUIDE.md).
