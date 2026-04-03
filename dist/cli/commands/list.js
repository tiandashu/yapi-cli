"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerList = registerList;
const chalk_1 = __importDefault(require("chalk"));
const format_1 = require("../core/format");
const service_1 = require("../core/service");
function registerList(program) {
    program
        .command('list')
        .alias('ls')
        .description('List interfaces in one or more projects')
        .option('-p, --project <ids>', 'Project ID or comma-separated project IDs')
        .option('-c, --cat <catName>', 'Filter by category name')
        .option('--json', 'Output JSON')
        .action(async (opts) => {
        try {
            const results = await (0, service_1.listInterfaces)({
                projectIds: opts.project,
                category: opts.cat,
            });
            if (opts.json) {
                console.log(JSON.stringify(results, null, 2));
            }
            else {
                (0, format_1.printList)(results);
            }
        }
        catch (e) {
            console.error(chalk_1.default.red(e.message));
            process.exit(1);
        }
    });
}
