"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTypes = registerTypes;
const chalk_1 = __importDefault(require("chalk"));
const format_1 = require("../core/format");
const service_1 = require("../core/service");
function registerTypes(program) {
    program
        .command('types <idOrPath>')
        .description('Generate TypeScript types from interface schema')
        .option('-p, --project <id>', 'Single project ID')
        .option('--name <typeName>', 'Override generated type name')
        .option('--json', 'Output JSON envelope (agent-friendly)')
        .action(async (idOrPath, opts) => {
        try {
            const result = await (0, service_1.generateTypes)({
                idOrPath,
                projectIds: opts.project,
                name: opts.name,
            });
            if (opts.json) {
                console.log(JSON.stringify(result, null, 2));
                return;
            }
            (0, format_1.printTypes)(result);
        }
        catch (e) {
            console.error(chalk_1.default.red(e.message));
            process.exit(1);
        }
    });
}
