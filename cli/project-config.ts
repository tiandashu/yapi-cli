import fs from 'fs';
import path from 'path';
import { YapiConfigFile, YapiProjectConfigEntry } from './types';

const CONFIG_FILENAME = 'yapi.config.json';

export interface LocatedConfig {
  path: string;
  config: YapiConfigFile;
}

export function findProjectConfig(cwd: string = process.cwd()): LocatedConfig | null {
  let dir = path.resolve(cwd);
  const root = path.parse(dir).root;

  while (true) {
    const candidate = path.join(dir, CONFIG_FILENAME);
    if (fs.existsSync(candidate)) {
      return {
        path: candidate,
        config: loadProjectConfigFile(candidate),
      };
    }
    if (dir === root) break;
    dir = path.dirname(dir);
  }

  return null;
}

export function loadProjectConfigFile(filePath: string): YapiConfigFile {
  let raw: unknown;

  try {
    raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (error: any) {
    throw new Error(`Failed to parse ${filePath}: ${error.message}`);
  }

  if (!raw || typeof raw !== 'object') {
    throw new Error(`${filePath} must contain a JSON object`);
  }

  const data = raw as Record<string, unknown>;
  const projects = normalizeProjects(data.projects);
  const defaultProjectId = normalizeOptionalString(data.defaultProjectId, 'defaultProjectId');
  const defaultProjectIds = normalizeDefaultProjectIds(data.defaultProjectIds ?? legacyDefaultProjectIds(data.defaultProjectId));

  if (projects.length === 0) {
    throw new Error(`${filePath} must define at least one project`);
  }

  return {
    baseUrl: normalizeOptionalString(data.baseUrl),
    projects,
    defaultProjectId,
    defaultProjectIds,
  };
}

export function writeProjectConfigFile(filePath: string, config: YapiConfigFile): void {
  fs.writeFileSync(filePath, `${JSON.stringify(config, null, 2)}\n`);
}

function normalizeProjects(value: unknown): YapiProjectConfigEntry[] {
  if (!Array.isArray(value)) {
    throw new Error(`"projects" must be an array`);
  }

  return value.map((item, index) => {
    if (!item || typeof item !== 'object') {
      throw new Error(`projects[${index}] must be an object`);
    }

    const project = item as Record<string, unknown>;
    const projectId = normalizeRequiredString(project.projectId, `projects[${index}].projectId`);
    const projectName = normalizeRequiredString(project.projectName, `projects[${index}].projectName`);
    const token = normalizeRequiredString(project.token, `projects[${index}].token`);
    const baseUrl = normalizeOptionalString(project.baseUrl);

    return { projectId, projectName, token, baseUrl };
  });
}

function legacyDefaultProjectIds(value: unknown): string[] | undefined {
  if (Array.isArray(value)) {
    return normalizeDefaultProjectIds(value);
  }
  return undefined;
}

function normalizeDefaultProjectIds(value: unknown): string[] | undefined {
  if (value == null) return undefined;
  if (Array.isArray(value)) {
    const ids = value
      .filter((item): item is string => typeof item === 'string')
      .map(item => item.trim())
      .filter(Boolean);
    return ids.length ? ids : undefined;
  }
  throw new Error(`"defaultProjectId" must be a string or string[]`);
}

function normalizeRequiredString(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`"${field}" must be a non-empty string`);
  }
  return value.trim();
}

function normalizeOptionalString(value: unknown, field = 'value'): string | undefined {
  if (value == null) return undefined;
  if (typeof value !== 'string') {
    throw new Error(`"${field}" must be a string`);
  }
  const normalized = value.trim();
  return normalized || undefined;
}
