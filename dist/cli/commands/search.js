"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSearch = registerSearch;
const chalk_1 = __importDefault(require("chalk"));
const format_1 = require("../core/format");
const service_1 = require("../core/service");
function registerSearch(program) {
    program
        .command('search <keyword>')
        .alias('s')
        .description('Search interfaces by title or path')
        .option('-p, --project <ids>', 'Project ID or comma-separated project IDs')
        .option('--json', 'Output JSON')
        .action(async (keyword, opts) => {
        try {
            const matches = await (0, service_1.searchInterfaces)({ keyword, projectIds: opts.project });
            if (matches.length === 0) {
                console.log(chalk_1.default.yellow(`No interfaces found matching "${keyword}"`));
                return;
            }
            if (opts.json) {
                console.log(JSON.stringify(matches, null, 2));
                return;
            }
            (0, format_1.printSearch)(matches);
        }
        catch (e) {
            console.error(chalk_1.default.red(e.message));
            process.exit(1);
        }
    });
}
