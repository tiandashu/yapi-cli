"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listInterfaces = listInterfaces;
exports.searchInterfaces = searchInterfaces;
exports.getInterfaceDetails = getInterfaceDetails;
exports.generateMockData = generateMockData;
exports.generateTypes = generateTypes;
const api_1 = require("../api");
const config_1 = require("../config");
const json_schema_1 = require("./json-schema");
async function listInterfaces(options = {}) {
    const { config } = (0, config_1.loadConfig)(options.cwd);
    const projects = (0, config_1.resolveProjectSelection)(config, options.projectIds);
    return Promise.all(projects.map(async (project) => {
        const client = (0, api_1.createClient)(project);
        const projectInfo = await (0, api_1.getProject)(client, project.token);
        const menu = await (0, api_1.getListMenu)(client, project.token, projectInfo._id);
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
async function searchInterfaces(options) {
    const { config } = (0, config_1.loadConfig)(options.cwd);
    const projects = (0, config_1.resolveProjectSelection)(config, options.projectIds);
    const keyword = options.keyword.toLowerCase();
    const results = await Promise.all(projects.map(async (project) => {
        const client = (0, api_1.createClient)(project);
        const projectInfo = await (0, api_1.getProject)(client, project.token);
        const menu = await (0, api_1.getListMenu)(client, project.token, projectInfo._id);
        return menu.flatMap(category => category.list
            .filter(iface => iface.title.toLowerCase().includes(keyword) || iface.path.toLowerCase().includes(keyword))
            .map(iface => ({
            project,
            id: iface._id,
            title: iface.title,
            method: iface.method,
            path: iface.path,
            category: category.name,
            status: iface.status,
        })));
    }));
    return results.flat();
}
async function getInterfaceDetails(options) {
    const { project, iface } = await resolveInterface(options);
    return buildCompactInterfaceDetail(project, iface, !!options.full);
}
async function generateMockData(options) {
    const { project, iface } = await resolveInterface(options);
    return {
        project,
        id: iface._id,
        path: iface.path,
        title: iface.title,
        mock: iface.res_body ? (0, json_schema_1.generateMock)(iface.res_body) : {},
    };
}
async function generateTypes(options) {
    const { project, iface } = await resolveInterface(options);
    const baseName = options.name || (0, json_schema_1.pathToTypeName)(iface.path);
    return {
        project,
        id: iface._id,
        path: iface.path,
        title: iface.title,
        baseName,
        code: (0, json_schema_1.generateTypesFromInterfaceSchema)(iface, baseName),
    };
}
async function resolveInterface(options) {
    const { config } = (0, config_1.loadConfig)(options.cwd);
    const project = (0, config_1.resolveSingleProject)(config, options.projectIds);
    const client = (0, api_1.createClient)(project);
    let id;
    if (!Number.isNaN(Number(options.idOrPath))) {
        id = Number(options.idOrPath);
    }
    else {
        const projectInfo = await (0, api_1.getProject)(client, project.token);
        const menu = await (0, api_1.getListMenu)(client, project.token, projectInfo._id);
        const found = menu
            .flatMap(category => category.list)
            .find(iface => iface.path === options.idOrPath || iface.path.includes(options.idOrPath));
        if (!found) {
            throw new Error(`Interface not found in project "${project.projectId}": ${options.idOrPath}`);
        }
        id = found._id;
    }
    const iface = await (0, api_1.getInterface)(client, project.token, id);
    return { project, iface };
}
function buildCompactInterfaceDetail(project, iface, full) {
    const detail = {
        project,
        id: iface._id,
        title: iface.title,
        method: iface.method,
        path: iface.path,
        status: iface.status,
    };
    if (iface.desc)
        detail.desc = iface.desc;
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
        if (headers.length)
            detail.headers = headers;
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
    }
    else if (iface.req_body_other) {
        detail.bodyType = 'json';
        if (full) {
            detail.bodySchema = (0, json_schema_1.tryParseJson)(iface.req_body_other);
        }
        else {
            detail.bodyFields = (0, json_schema_1.extractJsonSchemaFields)(iface.req_body_other);
        }
    }
    if (iface.res_body) {
        detail.responseType = iface.res_body_type || 'json';
        if (full) {
            detail.responseSchema = (0, json_schema_1.tryParseJson)(iface.res_body);
        }
        else {
            detail.responseFields = (0, json_schema_1.extractJsonSchemaFields)(iface.res_body);
        }
    }
    return detail;
}
