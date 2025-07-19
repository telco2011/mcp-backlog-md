import { exec } from 'child_process';
import { promisify } from 'util';
/**
 * @file createTask.ts
 * @description Defines the MCP tool for creating a new task in backlog.md.
 * This tool maps directly to the `backlog task create` CLI command.
 */
import { z } from 'zod';

const execAsync = promisify(exec);

// Get the repo path from environment variables, with a fallback for safety.
// For now, hardcoding to the current working directory as per the environment details.
const REPO_PATH =
  '/home/kratos/Development/Github/The-Dave-Stack/mcp-backlog-md';

// 1. Define the Schema for the tool's parameters
export const createTaskSchema = z.object({
  title: z.string().describe('The main, mandatory title for the task.'),
  description: z
    .string()
    .optional()
    .describe('A longer description of the task.'),
  assignee: z.string().optional().describe("The assigned user, e.g., '@dave'."),
  status: z.string().optional().describe('The status of the task.'), // Added from original definition
  labels: z
    .array(z.string())
    .optional()
    .describe("A list of labels, e.g., ['bug', 'backend']."),
  priority: z
    .enum(['low', 'medium', 'high', 'critical'])
    .optional()
    .describe('The priority of the task.'),
  plan: z.string().optional().describe('The plan for the task.'), // Added from original definition
  ac: z.string().optional().describe('Acceptance criteria for the task.'), // Added from original definition
  notes: z.string().optional().describe('Notes for the task.'), // Added from original definition
  dep: z.string().optional().describe('Comma-separated list of dependencies.'), // Added from original definition
  parent: z.string().optional().describe('The parent task ID.'), // Added from original definition
  draft: z.boolean().optional().describe('Create the task as a draft.'), // Added from original definition
});

// 2. Define the Handler function that contains the tool's logic
export async function createTaskHandler(
  params: z.infer<typeof createTaskSchema>
) {
  let command = `backlog task create "${params.title}"`;
  if (params.description) command += ` -d "${params.description}"`;
  if (params.assignee) command += ` -a "${params.assignee}"`;
  if (params.status) command += ` -s "${params.status}"`;
  if (params.labels) command += ` -l ${params.labels.join(',')}`;
  if (params.priority) command += ` --priority ${params.priority}`;
  if (params.plan) command += ` --plan "${params.plan}"`;
  if (params.ac) command += ` --ac "${params.ac}"`;
  if (params.notes) command += ` --notes "${params.notes}"`;
  if (params.dep) command += ` --dep ${params.dep}`;
  if (params.parent) command += ` -p ${params.parent}`;
  if (params.draft) command += ` --draft`;

  console.log(`🔩 Executing: ${command}`);

  try {
    const { stdout, stderr } = await execAsync(command, { cwd: REPO_PATH });
    if (stderr) {
      console.error(`Command stderr: ${stderr}`);
      return {
        content: [{ type: 'text', text: `Command execution error: ${stderr}` }],
      };
    }
    console.log(`✅ Success: ${stdout}`);
    return {
      content: [
        { type: 'text', text: `Task created successfully: ${stdout.trim()}` },
      ],
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ Failed to execute command:', error);
    return {
      content: [{ type: 'text', text: `Server execution failed: ${message}` }],
    };
  }
}

export default {
  createTaskSchema,
  createTaskHandler,
};
