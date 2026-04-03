import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { loadConfig } from '../config';
import { printConfig } from '../core/format';
import { writeProjectConfigFile } from '../project-config';
import { YapiConfigFile } from '../types';

export function registerConfig(program: Command): void {
  const config = program.command('config').description('Manage YApi CLI configuration');

  config
    .command('list')
    .description('Show the resolved yapi.config.json')
    .action(() => {
      try {
        printConfig(loadConfig());
      } catch (error: any) {
        console.error(chalk.red(error.message));
        process.exit(1);
      }
    });

  config
    .command('init')
    .description('Create yapi.config.json in the current directory')
    .action(() => {
      const dest = path.join(process.cwd(), 'yapi.config.json');

      if (fs.existsSync(dest)) {
        console.error(chalk.yellow(`yapi.config.json already exists`));
        process.exit(1);
      }

      writeProjectConfigFile(dest, TEMPLATE);
      console.log(chalk.green(`Created ${dest}`));
      console.log(chalk.gray('Edit it to add your YApi baseUrl and project tokens.'));
    });
}

const TEMPLATE: YapiConfigFile = {
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
