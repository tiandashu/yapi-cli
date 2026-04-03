"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryParseJson = tryParseJson;
exports.extractJsonSchemaFields = extractJsonSchemaFields;
exports.generateMock = generateMock;
exports.pathToTypeName = pathToTypeName;
exports.generateTypesFromInterfaceSchema = generateTypesFromInterfaceSchema;
function tryParseJson(value) {
    try {
        return JSON.parse(value);
    }
    catch {
        return value;
    }
}
function extractJsonSchemaFields(schemaStr) {
    try {
        const schema = JSON.parse(schemaStr);
        return flattenSchema(schema, '', schema.required || []);
    }
    catch {
        return [];
    }
}
function generateMock(schemaStr) {
    try {
        return mockFromSchema(JSON.parse(schemaStr));
    }
    catch {
        return {};
    }
}
function pathToTypeName(path) {
    return path
        .split('/')
        .filter(Boolean)
        .map(segment => segment.replace(/[^a-zA-Z0-9]/g, '_'))
        .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join('')
        .replace(/^[0-9]/, '_$&');
}
function generateTypesFromInterfaceSchema(iface, baseName) {
    const lines = [];
    lines.push(`// ${iface.method.toUpperCase()} ${iface.path}`);
    lines.push(`// ${iface.title}`);
    lines.push('');
    if (iface.req_query?.length) {
        lines.push(`export interface ${baseName}Query {`);
        for (const query of iface.req_query) {
            if (query.desc)
                lines.push(`  /** ${query.desc} */`);
            lines.push(`  ${query.name}${query.required === '1' ? '' : '?'}: string;`);
        }
        lines.push('}');
        lines.push('');
    }
    if (iface.req_body_form?.length) {
        lines.push(`export interface ${baseName}Body {`);
        for (const field of iface.req_body_form) {
            if (field.desc)
                lines.push(`  /** ${field.desc} */`);
            lines.push(`  ${field.name}${field.required === '1' ? '' : '?'}: ${formTypeToTs(field.type)};`);
        }
        lines.push('}');
        lines.push('');
    }
    else if (iface.req_body_other) {
        try {
            lines.push(schemaToTs(JSON.parse(iface.req_body_other), `${baseName}Body`, 0));
            lines.push('');
        }
        catch {
            // ignore invalid request schema
        }
    }
    if (iface.res_body) {
        try {
            lines.push(schemaToTs(JSON.parse(iface.res_body), `${baseName}Response`, 0));
        }
        catch {
            lines.push(`export type ${baseName}Response = unknown;`);
        }
    }
    return lines.join('\n').trim();
}
function flattenSchema(schema, prefix, required, depth = 0) {
    if (depth > 3 || !schema?.properties)
        return [];
    const result = [];
    for (const [key, value] of Object.entries(schema.properties)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        result.push({
            name: fullKey,
            type: value.type || (value.$ref ? 'object' : 'any'),
            required: required.includes(key),
            desc: value.description,
        });
        if (value.type === 'object' && value.properties) {
            result.push(...flattenSchema(value, fullKey, value.required || [], depth + 1));
        }
        else if (value.type === 'array' && value.items?.properties) {
            result.push(...flattenSchema(value.items, `${fullKey}[]`, value.items.required || [], depth + 1));
        }
    }
    return result;
}
function mockFromSchema(schema, depth = 0) {
    if (depth > 5 || !schema)
        return null;
    if (schema.mock?.mock)
        return schema.mock.mock;
    switch (schema.type) {
        case 'object': {
            const result = {};
            for (const [key, value] of Object.entries(schema.properties || {})) {
                result[key] = mockFromSchema(value, depth + 1);
            }
            return result;
        }
        case 'array':
            return schema.items ? [mockFromSchema(schema.items, depth + 1)] : [];
        case 'string':
            return schema.enum?.[0] ?? schema.example ?? 'string';
        case 'number':
        case 'integer':
            return schema.example ?? 0;
        case 'boolean':
            return schema.example ?? true;
        case 'null':
            return null;
        default:
            if (schema.properties)
                return mockFromSchema({ ...schema, type: 'object' }, depth);
            if (schema.items)
                return mockFromSchema({ ...schema, type: 'array' }, depth);
            return null;
    }
}
function formTypeToTs(type) {
    switch (type) {
        case 'text':
            return 'string';
        case 'file':
            return 'File';
        case 'number':
            return 'number';
        default:
            return 'string';
    }
}
function schemaToTs(schema, name, depth) {
    const lines = [];
    const indent = '  '.repeat(depth > 0 ? 1 : 0);
    if (schema.type === 'object' || schema.properties) {
        lines.push(depth === 0 ? `export interface ${name} {` : '{');
        const required = schema.required || [];
        for (const [key, value] of Object.entries(schema.properties || {})) {
            if (value.description)
                lines.push(`  ${indent}/** ${value.description} */`);
            const tsType = getFieldType(value, `${name}${capitalize(key)}`, depth + 1);
            lines.push(`  ${indent}${key}${required.includes(key) ? '' : '?'}: ${tsType};`);
        }
        lines.push(depth === 0 ? '}' : `${indent}}`);
        return lines.join('\n');
    }
    if (schema.type === 'array') {
        const itemType = schema.items ? getFieldType(schema.items, `${name}Item`, depth) : 'unknown';
        return depth === 0 ? `export type ${name} = ${itemType}[];` : `${itemType}[]`;
    }
    return `export type ${name} = ${jsonTypeToTs(schema.type, schema.enum)};`;
}
function getFieldType(schema, name, depth) {
    if (!schema)
        return 'unknown';
    if (schema.enum?.length)
        return schema.enum.map((value) => JSON.stringify(value)).join(' | ');
    if (schema.type === 'object' || schema.properties)
        return schemaToTs(schema, name, depth);
    if (schema.type === 'array') {
        const itemType = schema.items ? getFieldType(schema.items, `${name}Item`, depth) : 'unknown';
        return `${itemType}[]`;
    }
    return jsonTypeToTs(schema.type, schema.enum);
}
function jsonTypeToTs(type, enumValues) {
    if (enumValues?.length)
        return enumValues.map(value => JSON.stringify(value)).join(' | ');
    switch (type) {
        case 'string':
            return 'string';
        case 'number':
        case 'integer':
            return 'number';
        case 'boolean':
            return 'boolean';
        case 'null':
            return 'null';
        case 'array':
            return 'unknown[]';
        case 'object':
            return 'Record<string, unknown>';
        default:
            return 'unknown';
    }
}
function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}
