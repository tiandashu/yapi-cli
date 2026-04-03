import axios, { AxiosInstance } from 'axios';
import { ResolvedProject, YapiCategory, YapiInterface, YapiProjectInfo } from './types';

export function createClient(project: ResolvedProject): AxiosInstance {
  return axios.create({ baseURL: project.baseUrl, timeout: 10000 });
}

export async function getProject(client: AxiosInstance, token: string): Promise<YapiProjectInfo> {
  const res = await client.get('/api/project/get', { params: { token } });
  return res.data.data;
}

export async function getInterface(client: AxiosInstance, token: string, id: number): Promise<YapiInterface> {
  const res = await client.get('/api/interface/get', { params: { token, id } });
  return res.data.data;
}

export async function getListMenu(
  client: AxiosInstance,
  token: string,
  projectId: number
): Promise<Array<YapiCategory & { list: YapiInterface[] }>> {
  const res = await client.get('/api/interface/list_menu', { params: { token, project_id: projectId } });
  return res.data.data;
}
