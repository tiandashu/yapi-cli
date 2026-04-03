"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClient = createClient;
exports.getProject = getProject;
exports.getInterface = getInterface;
exports.getListMenu = getListMenu;
const axios_1 = __importDefault(require("axios"));
function createClient(project) {
    return axios_1.default.create({ baseURL: project.baseUrl, timeout: 10000 });
}
async function getProject(client, token) {
    const res = await client.get('/api/project/get', { params: { token } });
    return res.data.data;
}
async function getInterface(client, token, id) {
    const res = await client.get('/api/interface/get', { params: { token, id } });
    return res.data.data;
}
async function getListMenu(client, token, projectId) {
    const res = await client.get('/api/interface/list_menu', { params: { token, project_id: projectId } });
    return res.data.data;
}
