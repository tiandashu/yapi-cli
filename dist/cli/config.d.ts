import { ResolvedProject, YapiConfigFile } from './types';
export interface LoadedConfig {
    path: string;
    config: YapiConfigFile;
}
export declare function loadConfig(cwd?: string): LoadedConfig;
export declare function loadConfigFromFile(filePath: string): LoadedConfig;
export declare function resolveProjectSelection(config: YapiConfigFile, requested?: string | string[]): ResolvedProject[];
export declare function resolveSingleProject(config: YapiConfigFile, requested?: string | string[]): ResolvedProject;
export declare function resolveProjectById(config: YapiConfigFile, projectId: string): ResolvedProject;
export declare function normalizeRequestedProjectIds(value?: string | string[]): string[] | undefined;
