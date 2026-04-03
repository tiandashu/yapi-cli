"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findProjectConfig = findProjectConfig;
exports.loadProjectConfigFile = loadProjectConfigFile;
exports.writeProjectConfigFile = writeProjectConfigFile;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const CONFIG_FILENAME = 'yapi.config.json';
function findProjectConfig(cwd = process.cwd()) {
    let dir = path_1.default.resolve(cwd);
    const root = path_1.default.parse(dir).root;
    while (true) {
        const candidate = path_1.default.join(dir, CONFIG_FILENAME);
        if (fs_1.default.existsSync(candidate)) {
            return {
                path: candidate,
                config: loadProjectConfigFile(candidate),
            };
        }
        if (dir === root)
            break;
        dir = path_1.default.dirname(dir);
    }
    return null;
}
function loadProjectConfigFile(filePath) {
    let raw;
    try {
        raw = JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
    }
    catch (error) {
        throw new Error(`Failed to parse ${filePath}: ${error.message}`);
    }
    if (!raw || typeof raw !== 'object') {
        throw new Error(`${filePath} must contain a JSON object`);
    }
    const data = raw;
    const projects = normalizeProjects(data.projects);
    const activeProjectIds = normalizeActiveProjectIds(data.activeProjectIds);
    if (projects.length === 0) {
        throw new Error(`${filePath} must define at least one project`);
    }
    if (!activeProjectIds?.length) {
        throw new Error(`${filePath} must define a non-empty "activeProjectIds" array`);
    }
    const projectIdSet = new Set(projects.map(p => p.projectId));
    for (const id of activeProjectIds) {
        if (!projectIdSet.has(id)) {
            throw new Error(`${filePath}: activeProjectIds contains unknown projectId "${id}"`);
        }
    }
    return {
        baseUrl: normalizeOptionalString(data.baseUrl),
        projects,
        activeProjectIds,
    };
}
function writeProjectConfigFile(filePath, config) {
    fs_1.default.writeFileSync(filePath, `${JSON.stringify(config, null, 2)}\n`);
}
function normalizeProjects(value) {
    if (!Array.isArray(value)) {
        throw new Error(`"projects" must be an array`);
    }
    return value.map((item, index) => {
        if (!item || typeof item !== 'object') {
            throw new Error(`projects[${index}] must be an object`);
        }
        const project = item;
        const projectId = normalizeRequiredString(project.projectId, `projects[${index}].projectId`);
        const projectName = normalizeRequiredString(project.projectName, `projects[${index}].projectName`);
        const token = normalizeRequiredString(project.token, `projects[${index}].token`);
        const baseUrl = normalizeOptionalString(project.baseUrl);
        return { projectId, projectName, token, baseUrl };
    });
}
function normalizeActiveProjectIds(value) {
    if (value == null)
        return undefined;
    if (Array.isArray(value)) {
        const ids = value
            .filter((item) => typeof item === 'string')
            .map(item => item.trim())
            .filter(Boolean);
        return ids.length ? Array.from(new Set(ids)) : undefined;
    }
    throw new Error(`"activeProjectIds" must be an array of strings`);
}
function normalizeRequiredString(value, field) {
    if (typeof value !== 'string' || !value.trim()) {
        throw new Error(`"${field}" must be a non-empty string`);
    }
    return value.trim();
}
function normalizeOptionalString(value, field = 'value') {
    if (value == null)
        return undefined;
    if (typeof value !== 'string') {
        throw new Error(`"${field}" must be a string`);
    }
    const normalized = value.trim();
    return normalized || undefined;
}
