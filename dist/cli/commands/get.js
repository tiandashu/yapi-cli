"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerGet = registerGet;
const chalk_1 = __importDefault(require("chalk"));
const format_1 = require("../core/format");
const service_1 = require("../core/service");
function registerGet(program) {
    program
        .command('get <idOrPath>')
        .description('Get interface details (compact format for LLM)')
        .option('-p, --project <id>', 'Single project ID')
        .option('--full', 'Show full raw response body schemas')
        .option('--json', 'Output JSON')
        .action(async (idOrPath, opts) => {
        try {
            const detail = await (0, service_1.getInterfaceDetails)({
                idOrPath,
                projectIds: opts.project,
                full: opts.full,
            });
            if (opts.json) {
                console.log(JSON.stringify(detail, null, 2));
                return;
            }
            (0, format_1.printInterface)(detail);
        }
        catch (e) {
            console.error(chalk_1.default.red(e.message));
            process.exit(1);
        }
    });
}
