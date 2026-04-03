import { findProjectConfig, loadProjectConfigFile } from './project-config';
import { ResolvedProject, YapiConfigFile } from './types';

export interface LoadedConfig {
  path: string;
  config: YapiConfigFile;
}

export function loadConfig(cwd: string = process.cwd()): LoadedConfig {
  const located = findProjectConfig(cwd);
  if (!located) {
    throw new Error(`No yapi.config.json found from ${cwd} upwards`);
  }

  return located;
}

export function loadConfigFromFile(filePath: string): LoadedConfig {
  return { path: filePath, config: loadProjectConfigFile(filePath) };
}

export function resolveProjectSelection(config: YapiConfigFile, requested?: string | string[]): ResolvedProject[] {
  const requestedIds = normalizeRequestedProjectIds(requested);
  const targetIds = requestedIds ?? inferMultiProjectDefaults(config);

  if (targetIds.length === 0) {
    throw new Error(`No project selected. Use --project <projectId> or set activeProjectIds in yapi.config.json`);
  }

  return targetIds.map(projectId => resolveProjectById(config, projectId));
}

export function resolveSingleProject(config: YapiConfigFile, requested?: string | string[]): ResolvedProject {
  const requestedIds = normalizeRequestedProjectIds(requested);
  const targetId = requestedIds?.[0] ?? inferSingleProjectDefault(config);

  if (!targetId) {
    throw new Error(
      `Exactly one project is required here. Pass --project <projectId> or set activeProjectIds to a single id in yapi.config.json`
    );
  }

  if (requestedIds && requestedIds.length > 1) {
    const ids = requestedIds.join(', ');
    throw new Error(`Exactly one project is required here. Current selection: ${ids}`);
  }

  return resolveProjectById(config, targetId);
}

export function resolveProjectById(config: YapiConfigFile, projectId: string): ResolvedProject {
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

export function normalizeRequestedProjectIds(value?: string | string[]): string[] | undefined {
  if (!value) return undefined;

  const input = Array.isArray(value) ? value : [value];
  const ids = input
    .flatMap(item => item.split(','))
    .map(item => item.trim())
    .filter(Boolean);

  return ids.length ? Array.from(new Set(ids)) : undefined;
}

function inferMultiProjectDefaults(config: YapiConfigFile): string[] {
  return [...config.activeProjectIds];
}

function inferSingleProjectDefault(config: YapiConfigFile): string | undefined {
  if (config.activeProjectIds.length === 1) {
    return config.activeProjectIds[0];
  }
  return undefined;
}

function assertIdsActive(config: YapiConfigFile, ids: string[]): void {
  const active = new Set(config.activeProjectIds);
  for (const id of ids) {
    if (!active.has(id)) {
      throw new Error(
        `Project "${id}" is not in activeProjectIds. Active: ${config.activeProjectIds.join(', ')}`
      );
    }
  }
}

function normalizeBaseUrl(baseUrl?: string): string | undefined {
  if (!baseUrl) return undefined;
  return baseUrl.replace(/\/$/, '');
}
