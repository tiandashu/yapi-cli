"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerMock = registerMock;
const chalk_1 = __importDefault(require("chalk"));
const format_1 = require("../core/format");
const service_1 = require("../core/service");
function registerMock(program) {
    program
        .command('mock <idOrPath>')
        .description('Generate mock data from interface response schema')
        .option('-p, --project <id>', 'Single project ID')
        .option('--json', 'Output JSON envelope')
        .action(async (idOrPath, opts) => {
        try {
            const result = await (0, service_1.generateMockData)({ idOrPath, projectIds: opts.project });
            if (opts.json) {
                console.log(JSON.stringify(result, null, 2));
            }
            else {
                (0, format_1.printMock)(result);
            }
        }
        catch (e) {
            console.error(chalk_1.default.red(e.message));
            process.exit(1);
        }
    });
}
