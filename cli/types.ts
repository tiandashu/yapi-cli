export interface YapiProjectConfigEntry {
  projectId: string;
  projectName: string;
  token: string;
  baseUrl?: string;
}

export interface YapiConfigFile {
  baseUrl?: string;
  projects: YapiProjectConfigEntry[];
  defaultProjectId?: string;
  defaultProjectIds?: string[];
}

export interface ResolvedProject {
  projectId: string;
  projectName: string;
  token: string;
  baseUrl: string;
}

export interface YapiInterface {
  _id: number;
  title: string;
  path: string;
  method: string;
  status: string;
  catid: number;
  project_id: number;
  desc?: string;
  req_query?: Array<{ name: string; required: string; desc?: string; example?: string }>;
  req_headers?: Array<{ name: string; value?: string; required: string; desc?: string }>;
  req_params?: Array<{ name: string; desc?: string }>;
  req_body_type?: string;
  req_body_form?: Array<{ name: string; type: string; required: string; desc?: string; example?: string }>;
  req_body_other?: string;
  res_body_type?: string;
  res_body?: string;
}

export interface YapiCategory {
  _id: number;
  name: string;
  project_id: number;
  desc?: string;
}

export interface YapiProjectInfo {
  _id: number;
  name: string;
  basepath: string;
  desc?: string;
}

export interface ListInterfacesResult {
  project: ResolvedProject;
  projectInfo: YapiProjectInfo;
  categories: Array<{
    category: string;
    interfaces: Array<{
      id: number;
      title: string;
      method: string;
      path: string;
      status: string;
    }>;
  }>;
}

export interface SearchMatch {
  project: ResolvedProject;
  id: number;
  title: string;
  method: string;
  path: string;
  category: string;
  status: string;
}

export interface SchemaField {
  name: string;
  type: string;
  required: boolean;
  desc?: string;
}

export interface CompactInterfaceDetail {
  project: ResolvedProject;
  id: number;
  title: string;
  method: string;
  path: string;
  status: string;
  desc?: string;
  pathParams?: Array<{ name: string; desc?: string }>;
  query?: Array<{ name: string; required: boolean; desc?: string; example?: string }>;
  headers?: Array<{ name: string; required: boolean; desc?: string }>;
  bodyType?: string;
  body?: Array<{ name: string; type: string; required: boolean; desc?: string; example?: string }>;
  bodyFields?: SchemaField[];
  bodySchema?: unknown;
  responseType?: string;
  responseFields?: SchemaField[];
  responseSchema?: unknown;
}

export interface MockResult {
  project: ResolvedProject;
  id: number;
  path: string;
  title: string;
  mock: unknown;
}

export interface TypeGenerationResult {
  project: ResolvedProject;
  id: number;
  path: string;
  title: string;
  baseName: string;
  code: string;
}
