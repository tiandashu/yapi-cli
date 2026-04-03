"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.printConfig = printConfig;
exports.printList = printList;
exports.printSearch = printSearch;
exports.printInterface = printInterface;
exports.printMock = printMock;
exports.printTypes = printTypes;
const chalk_1 = __importDefault(require("chalk"));
function printConfig(config) {
    console.log(chalk_1.default.bold('Config file:'), config.path);
    console.log(chalk_1.default.bold('Active projectIds:'), config.config.activeProjectIds.join(', '));
    console.log(chalk_1.default.bold('Projects:'));
    for (const project of config.config.projects) {
        const baseUrl = project.baseUrl || config.config.baseUrl || '(missing baseUrl)';
        console.log(`  ${chalk_1.default.bold(project.projectId)}  ${chalk_1.default.gray(project.projectName)}  ${chalk_1.default.cyan(baseUrl)}`);
    }
}
function printList(results) {
    for (const result of results) {
        console.log(chalk_1.default.bold(`\nProject: ${result.project.projectId} ${chalk_1.default.gray(`(${result.project.projectName})`)} ${chalk_1.default.cyan(result.project.baseUrl)}`));
        console.log(chalk_1.default.gray(`YApi: ${result.projectInfo.name} ${result.projectInfo.basepath || '/'}`));
        for (const category of result.categories) {
            console.log(chalk_1.default.cyan(`[${category.category}]`));
            for (const iface of category.interfaces) {
                const method = iface.method.toUpperCase().padEnd(7);
                const status = iface.status === 'done' ? chalk_1.default.green('✓') : chalk_1.default.yellow('○');
                console.log(`  ${status} ${chalk_1.default.bold(method)} ${iface.path.padEnd(40)} ${chalk_1.default.gray(iface.title)} ${chalk_1.default.gray(`#${iface.id}`)}`);
            }
            console.log();
        }
    }
}
function printSearch(matches) {
    if (matches.length === 0) {
        console.log(chalk_1.default.yellow('No interfaces found'));
        return;
    }
    console.log(chalk_1.default.bold(`\nFound ${matches.length} interface(s):\n`));
    for (const match of matches) {
        const method = match.method.toUpperCase().padEnd(7);
        const status = match.status === 'done' ? chalk_1.default.green('✓') : chalk_1.default.yellow('○');
        console.log(`  ${status} ${chalk_1.default.bold(method)} ${match.path.padEnd(40)} ${chalk_1.default.gray(match.title)} ${chalk_1.default.gray(`#${match.id}`)}`);
        console.log(`    ${chalk_1.default.gray(`[${match.project.projectId}/${match.category}] ${match.project.projectName}`)}`);
    }
    console.log();
}
function printInterface(detail) {
    const method = detail.method.toUpperCase();
    const statusColor = detail.status === 'done' ? chalk_1.default.green : chalk_1.default.yellow;
    console.log(`\n${chalk_1.default.bold(method)} ${chalk_1.default.cyan(detail.path)}  ${statusColor(`[${detail.status}]`)}  ${chalk_1.default.gray(`#${detail.id}`)}`);
    console.log(chalk_1.default.bold(`${detail.title}  ${chalk_1.default.gray(`[${detail.project.projectId}] ${detail.project.projectName}`)}`));
    if (detail.desc)
        console.log(chalk_1.default.gray(detail.desc));
    if (detail.pathParams?.length) {
        console.log(chalk_1.default.bold('\nPath Params:'));
        for (const param of detail.pathParams)
            console.log(`  :${param.name}  ${chalk_1.default.gray(param.desc || '')}`);
    }
    if (detail.query?.length) {
        console.log(chalk_1.default.bold('\nQuery:'));
        for (const query of detail.query) {
            const required = query.required ? chalk_1.default.red('*') : ' ';
            console.log(`  ${required} ${query.name}${query.example ? `=${query.example}` : ''}  ${chalk_1.default.gray(query.desc || '')}`);
        }
    }
    if (detail.headers?.length) {
        console.log(chalk_1.default.bold('\nHeaders:'));
        for (const header of detail.headers) {
            const required = header.required ? chalk_1.default.red('*') : ' ';
            console.log(`  ${required} ${header.name}  ${chalk_1.default.gray(header.desc || '')}`);
        }
    }
    if (detail.body?.length) {
        console.log(chalk_1.default.bold(`\nBody (${detail.bodyType}):`));
        for (const field of detail.body) {
            const required = field.required ? chalk_1.default.red('*') : ' ';
            console.log(`  ${required} ${field.name}: ${chalk_1.default.cyan(field.type)}${field.example ? `  e.g. ${field.example}` : ''}  ${chalk_1.default.gray(field.desc || '')}`);
        }
    }
    else if (detail.bodyFields?.length) {
        console.log(chalk_1.default.bold('\nBody (JSON):'));
        for (const field of detail.bodyFields) {
            const required = field.required ? chalk_1.default.red('*') : ' ';
            console.log(`  ${required} ${field.name}: ${chalk_1.default.cyan(field.type)}  ${chalk_1.default.gray(field.desc || '')}`);
        }
    }
    else if (detail.bodySchema) {
        console.log(chalk_1.default.bold('\nBody Schema:'));
        console.log(JSON.stringify(detail.bodySchema, null, 2));
    }
    if (detail.responseFields?.length) {
        console.log(chalk_1.default.bold('\nResponse:'));
        for (const field of detail.responseFields) {
            console.log(`  ${field.name}: ${chalk_1.default.cyan(field.type)}  ${chalk_1.default.gray(field.desc || '')}`);
        }
    }
    else if (detail.responseSchema) {
        console.log(chalk_1.default.bold('\nResponse Schema:'));
        console.log(JSON.stringify(detail.responseSchema, null, 2));
    }
    console.log();
}
function printMock(result) {
    console.log(JSON.stringify(result.mock, null, 2));
}
function printTypes(result) {
    console.log(result.code);
}
