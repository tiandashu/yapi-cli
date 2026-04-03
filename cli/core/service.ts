import { createClient, getInterface, getListMenu, getProject } from '../api';
import { loadConfig, resolveProjectSelection, resolveSingleProject } from '../config';
import {
  CompactInterfaceDetail,
  ListInterfacesResult,
  MockResult,
  ResolvedProject,
  SearchMatch,
  TypeGenerationResult,
  YapiInterface,
} from '../types';
import {
  extractJsonSchemaFields,
  generateMock,
  generateTypesFromInterfaceSchema,
  pathToTypeName,
  tryParseJson,
} from './json-schema';

export interface ProjectScopedOptions {
  cwd?: string;
  projectIds?: string | string[];
}

export interface ListOptions extends ProjectScopedOptions {
  category?: string;
}

export interface SearchOptions extends ProjectScopedOptions {
  keyword: string;
}

export interface GetOptions extends ProjectScopedOptions {
  idOrPath: string;
  full?: boolean;
}

export interface TypesOptions extends ProjectScopedOptions {
  idOrPath: string;
  name?: string;
}

export async function listInterfaces(options: ListOptions = {}): Promise<ListInterfacesResult[]> {
  const { config } = loadConfig(options.cwd);
  const projects = resolveProjectSelection(config, options.projectIds);

  return Promise.all(projects.map(async project => {
    const client = createClient(project);
    const projectInfo = await getProject(client, project.token);
    const menu = await getListMenu(client, project.token, projectInfo._id);

    const categories = menu
      .filter(category => !options.category || category.name.includes(options.category))
      .map(category => ({
        category: category.name,
        interfaces: category.list.map(iface => ({
          id: iface._id,
          title: iface.title,
          method: iface.method,
          path: iface.path,
          status: iface.status,
        })),
      }));

    return { project, projectInfo, categories };
  }));
}

export async function searchInterfaces(options: SearchOptions): Promise<SearchMatch[]> {
  const { config } = loadConfig(options.cwd);
  const projects = resolveProjectSelection(config, options.projectIds);
  const keyword = options.keyword.toLowerCase();

  const results = await Promise.all(projects.map(async project => {
    const client = createClient(project);
    const projectInfo = await getProject(client, project.token);
    const menu = await getListMenu(client, project.token, projectInfo._id);

    return menu.flatMap(category =>
      category.list
        .filter(iface => iface.title.toLowerCase().includes(keyword) || iface.path.toLowerCase().includes(keyword))
        .map(iface => ({
          project,
          id: iface._id,
          title: iface.title,
          method: iface.method,
          path: iface.path,
          category: category.name,
          status: iface.status,
        }))
    );
  }));

  return results.flat();
}

export async function getInterfaceDetails(options: GetOptions): Promise<CompactInterfaceDetail> {
  const { project, iface } = await resolveInterface(options);
  return buildCompactInterfaceDetail(project, iface, !!options.full);
}

export async function generateMockData(options: GetOptions): Promise<MockResult> {
  const { project, iface } = await resolveInterface(options);
  return {
    project,
    id: iface._id,
    path: iface.path,
    title: iface.title,
    mock: iface.res_body ? generateMock(iface.res_body) : {},
  };
}

export async function generateTypes(options: TypesOptions): Promise<TypeGenerationResult> {
  const { project, iface } = await resolveInterface(options);
  const baseName = options.name || pathToTypeName(iface.path);

  return {
    project,
    id: iface._id,
    path: iface.path,
    title: iface.title,
    baseName,
    code: generateTypesFromInterfaceSchema(iface, baseName),
  };
}

async function resolveInterface(options: GetOptions | TypesOptions): Promise<{ project: ResolvedProject; iface: YapiInterface }> {
  const { config } = loadConfig(options.cwd);
  const project = resolveSingleProject(config, options.projectIds);
  const client = createClient(project);

  let id: number;
  if (!Number.isNaN(Number(options.idOrPath))) {
    id = Number(options.idOrPath);
  } else {
    const projectInfo = await getProject(client, project.token);
    const menu = await getListMenu(client, project.token, projectInfo._id);
    const found = menu
      .flatMap(category => category.list)
      .find(iface => iface.path === options.idOrPath || iface.path.includes(options.idOrPath));

    if (!found) {
      throw new Error(`Interface not found in project "${project.projectId}": ${options.idOrPath}`);
    }

    id = found._id;
  }

  const iface = await getInterface(client, project.token, id);
  return { project, iface };
}

function buildCompactInterfaceDetail(project: ResolvedProject, iface: YapiInterface, full: boolean): CompactInterfaceDetail {
  const detail: CompactInterfaceDetail = {
    project,
    id: iface._id,
    title: iface.title,
    method: iface.method,
    path: iface.path,
    status: iface.status,
  };

  if (iface.desc) detail.desc = iface.desc;

  if (iface.req_params?.length) {
    detail.pathParams = iface.req_params.map(param => ({ name: param.name, desc: param.desc }));
  }

  if (iface.req_query?.length) {
    detail.query = iface.req_query.map(query => ({
      name: query.name,
      required: query.required === '1',
      desc: query.desc,
      example: query.example,
    }));
  }

  if (iface.req_headers?.length) {
    const headers = iface.req_headers
      .filter(header => header.name !== 'Content-Type')
      .map(header => ({ name: header.name, required: header.required === '1', desc: header.desc }));
    if (headers.length) detail.headers = headers;
  }

  if (iface.req_body_type && iface.req_body_type !== 'raw') {
    detail.bodyType = iface.req_body_type;
    if (iface.req_body_form?.length) {
      detail.body = iface.req_body_form.map(field => ({
        name: field.name,
        type: field.type,
        required: field.required === '1',
        desc: field.desc,
        example: field.example,
      }));
    }
  } else if (iface.req_body_other) {
    detail.bodyType = 'json';
    if (full) {
      detail.bodySchema = tryParseJson(iface.req_body_other);
    } else {
      detail.bodyFields = extractJsonSchemaFields(iface.req_body_other);
    }
  }

  if (iface.res_body) {
    detail.responseType = iface.res_body_type || 'json';
    if (full) {
      detail.responseSchema = tryParseJson(iface.res_body);
    } else {
      detail.responseFields = extractJsonSchemaFields(iface.res_body);
    }
  }

  return detail;
}
