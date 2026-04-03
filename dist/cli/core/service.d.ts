import { CompactInterfaceDetail, ListInterfacesResult, MockResult, SearchMatch, TypeGenerationResult } from '../types';
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
export declare function listInterfaces(options?: ListOptions): Promise<ListInterfacesResult[]>;
export declare function searchInterfaces(options: SearchOptions): Promise<SearchMatch[]>;
export declare function getInterfaceDetails(options: GetOptions): Promise<CompactInterfaceDetail>;
export declare function generateMockData(options: GetOptions): Promise<MockResult>;
export declare function generateTypes(options: TypesOptions): Promise<TypeGenerationResult>;
