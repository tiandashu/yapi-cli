"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerConfig = registerConfig;
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config_1 = require("../config");
const format_1 = require("../core/format");
const project_config_1 = require("../project-config");
function registerConfig(program) {
    const config = program.command('config').description('Manage YApi CLI configuration');
    config
        .command('list')
        .description('Show the resolved yapi.config.json')
        .action(() => {
        try {
            (0, format_1.printConfig)((0, config_1.loadConfig)());
        }
        catch (error) {
            console.error(chalk_1.default.red(error.message));
            process.exit(1);
        }
    });
    config
        .command('init')
        .description('Create yapi.config.json in the current directory')
        .action(() => {
        const dest = path_1.default.join(process.cwd(), 'yapi.config.json');
        if (fs_1.default.existsSync(dest)) {
            console.error(chalk_1.default.yellow(`yapi.config.json already exists`));
            process.exit(1);
        }
        (0, project_config_1.writeProjectConfigFile)(dest, TEMPLATE);
        console.log(chalk_1.default.green(`Created ${dest}`));
        console.log(chalk_1.default.gray('Edit it to add your YApi baseUrl and project tokens.'));
    });
}
const TEMPLATE = {
    baseUrl: 'https://your-yapi.example.com',
    projects: [
        {
            projectId: '1437',
            projectName: 'Example Project',
            token: 'your_project_token_here',
        },
    ],
    activeProjectIds: ['1437'],
};
