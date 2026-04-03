"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = loadConfig;
exports.loadConfigFromFile = loadConfigFromFile;
exports.resolveProjectSelection = resolveProjectSelection;
exports.resolveSingleProject = resolveSingleProject;
exports.resolveProjectById = resolveProjectById;
exports.normalizeRequestedProjectIds = normalizeRequestedProjectIds;
const project_config_1 = require("./project-config");
function loadConfig(cwd = process.cwd()) {
    const located = (0, project_config_1.findProjectConfig)(cwd);
    if (!located) {
        throw new Error(`No yapi.config.json found from ${cwd} upwards`);
    }
    return located;
}
function loadConfigFromFile(filePath) {
    return { path: filePath, config: (0, project_config_1.loadProjectConfigFile)(filePath) };
}
function resolveProjectSelection(config, requested) {
    const requestedIds = normalizeRequestedProjectIds(requested);
    const targetIds = requestedIds ?? inferMultiProjectDefaults(config);
    if (targetIds.length === 0) {
        throw new Error(`No project selected. Use --project <projectId> or set activeProjectIds in yapi.config.json`);
    }
    return targetIds.map(projectId => resolveProjectById(config, projectId));
}
function resolveSingleProject(config, requested) {
    const requestedIds = normalizeRequestedProjectIds(requested);
    const targetId = requestedIds?.[0] ?? inferSingleProjectDefault(config);
    if (!targetId) {
        throw new Error(`Exactly one project is required here. Pass --project <projectId> or set activeProjectIds to a single id in yapi.config.json`);
    }
    if (requestedIds && requestedIds.length > 1) {
        const ids = requestedIds.join(', ');
        throw new Error(`Exactly one project is required here. Current selection: ${ids}`);
    }
    return resolveProjectById(config, targetId);
}
function resolveProjectById(config, projectId) {
    assertIdsActive(config, [projectId]);
    const match = config.projects.find(project => project.projectId === projectId);
    if (!match) {
        const available = config.projects.map(project => project.projectId).join(', ');
        throw new Error(`Project "${projectId}" not found. Available projectIds: ${available}`);
    }
    const baseUrl = normalizeBaseUrl(match.baseUrl ?? config.baseUrl);
    if (!baseUrl) {
        throw new Error(`Project "${projectId}" has no baseUrl and config.baseUrl is not set`);
    }
    return {
        projectId: match.projectId,
        projectName: match.projectName,
        token: match.token,
        baseUrl,
    };
}
function normalizeRequestedProjectIds(value) {
    if (!value)
        return undefined;
    const input = Array.isArray(value) ? value : [value];
    const ids = input
        .flatMap(item => item.split(','))
        .map(item => item.trim())
        .filter(Boolean);
    return ids.length ? Array.from(new Set(ids)) : undefined;
}
function inferMultiProjectDefaults(config) {
    return [...config.activeProjectIds];
}
function inferSingleProjectDefault(config) {
    if (config.activeProjectIds.length === 1) {
        return config.activeProjectIds[0];
    }
    return undefined;
}
function assertIdsActive(config, ids) {
    const active = new Set(config.activeProjectIds);
    for (const id of ids) {
        if (!active.has(id)) {
            throw new Error(`Project "${id}" is not in activeProjectIds. Active: ${config.activeProjectIds.join(', ')}`);
        }
    }
}
function normalizeBaseUrl(baseUrl) {
    if (!baseUrl)
        return undefined;
    return baseUrl.replace(/\/$/, '');
}
