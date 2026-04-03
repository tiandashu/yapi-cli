import { YapiConfigFile } from './types';
export interface LocatedConfig {
    path: string;
    config: YapiConfigFile;
}
export declare function findProjectConfig(cwd?: string): LocatedConfig | null;
export declare function loadProjectConfigFile(filePath: string): YapiConfigFile;
export declare function writeProjectConfigFile(filePath: string, config: YapiConfigFile): void;
