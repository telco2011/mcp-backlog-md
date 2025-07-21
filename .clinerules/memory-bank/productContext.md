# Product Context

## Problem Space

Existing backlog management tools, including the base `backlog.md` CLI tool, are designed for direct human interaction. There is no straightforward way for an automated system or AI agent to programmatically manage a backlog stored in markdown files. This project solves that problem by providing a standardized MCP server interface that acts as a bridge to the `backlog.md` tool, enabling programmatic control over the backlog.

## User Persona

The primary user is an **AI Assistant** or another automated software agent. This agent needs to create, view, and manage development tasks within a project's file system on behalf of a human user, but requires a structured API (like MCP) to do so.

A secondary user is a **developer** who wants to integrate backlog management into their automated workflows.

## Core User Stories

- As a developer, I want to quickly add a task to my backlog from the command line.
- As a project manager, I want to view the current status of all tasks in a Kanban-style board.
- As an AI agent, I want to interact with the backlog programmatically via the MCP server.
