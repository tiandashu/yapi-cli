#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const zod_1 = require("zod");
const public_api_1 = require("../cli/public-api");
const server = new mcp_js_1.McpServer({
    name: 'yapi-mcp',
    version: '1.0.0',
});
server.tool('yapi_search', 'Search interfaces by keyword across one or more configured projects.', {
    keyword: zod_1.z.string().describe('Search keyword'),
    projectIds: zod_1.z.array(zod_1.z.string()).optional().describe('Optional projectId list'),
}, async ({ keyword, projectIds }) => ({
    content: [{ type: 'text', text: JSON.stringify(await (0, public_api_1.searchInterfaces)({ keyword, projectIds }), null, 2) }],
}));
server.tool('yapi_list', 'List interfaces grouped by category across one or more configured projects.', {
    projectIds: zod_1.z.array(zod_1.z.string()).optional().describe('Optional projectId list'),
    category: zod_1.z.string().optional().describe('Optional category filter'),
}, async ({ projectIds, category }) => ({
    content: [{ type: 'text', text: JSON.stringify(await (0, public_api_1.listInterfaces)({ projectIds, category }), null, 2) }],
}));
server.tool('yapi_get', 'Get compact interface details for a single project.', {
    idOrPath: zod_1.z.string().describe('Interface ID or path'),
    projectId: zod_1.z.string().optional().describe('Single projectId'),
    full: zod_1.z.boolean().optional().describe('Include raw schemas'),
}, async ({ idOrPath, projectId, full }) => ({
    content: [{ type: 'text', text: JSON.stringify(await (0, public_api_1.getInterfaceDetails)({ idOrPath, projectIds: projectId, full }), null, 2) }],
}));
server.tool('yapi_mock', 'Generate mock response data for a single project interface.', {
    idOrPath: zod_1.z.string().describe('Interface ID or path'),
    projectId: zod_1.z.string().optional().describe('Single projectId'),
}, async ({ idOrPath, projectId }) => ({
    content: [{ type: 'text', text: JSON.stringify(await (0, public_api_1.generateMockData)({ idOrPath, projectIds: projectId }), null, 2) }],
}));
server.tool('yapi_types', 'Generate TypeScript types for a single project interface.', {
    idOrPath: zod_1.z.string().describe('Interface ID or path'),
    projectId: zod_1.z.string().optional().describe('Single projectId'),
    name: zod_1.z.string().optional().describe('Optional base type name'),
}, async ({ idOrPath, projectId, name }) => ({
    content: [{ type: 'text', text: JSON.stringify(await (0, public_api_1.generateTypes)({ idOrPath, projectIds: projectId, name }), null, 2) }],
}));
async function main() {
    // Stdout is reserved for MCP JSON-RPC; do not log there. In a normal TTY, hint on stderr.
    if (process.stdin.isTTY && process.stderr.isTTY) {
        console.error('yapi-mcp: listening on stdio (stdout is MCP protocol only). Use an MCP client to connect, or Ctrl+C to exit.');
    }
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
}
main().catch(error => {
    console.error(error);
    process.exit(1);
});
