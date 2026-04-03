import { SchemaField } from '../types';
export declare function tryParseJson(value: string): unknown;
export declare function extractJsonSchemaFields(schemaStr: string): SchemaField[];
export declare function generateMock(schemaStr: string): unknown;
export declare function pathToTypeName(path: string): string;
export declare function generateTypesFromInterfaceSchema(iface: {
    method: string;
    path: string;
    title: string;
    req_query?: Array<{
        name: string;
        required: string;
        desc?: string;
    }>;
    req_body_form?: Array<{
        name: string;
        type: string;
        required: string;
        desc?: string;
    }>;
    req_body_other?: string;
    res_body?: string;
}, baseName: string): string;
