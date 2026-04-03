import { AxiosInstance } from 'axios';
import { ResolvedProject, YapiCategory, YapiInterface, YapiProjectInfo } from './types';
export declare function createClient(project: ResolvedProject): AxiosInstance;
export declare function getProject(client: AxiosInstance, token: string): Promise<YapiProjectInfo>;
export declare function getInterface(client: AxiosInstance, token: string, id: number): Promise<YapiInterface>;
export declare function getListMenu(client: AxiosInstance, token: string, projectId: number): Promise<Array<YapiCategory & {
    list: YapiInterface[];
}>>;
