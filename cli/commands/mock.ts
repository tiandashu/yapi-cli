import { Command } from 'commander';
import chalk from 'chalk';
import { printMock } from '../core/format';
import { generateMockData } from '../core/service';

export function registerMock(program: Command): void {
  program
    .command('mock <idOrPath>')
    .description('Generate mock data from interface response schema')
    .option('-p, --project <id>', 'Single project ID')
    .option('--json', 'Output JSON envelope')
    .action(async (idOrPath: string, opts) => {
      try {
        const result = await generateMockData({ idOrPath, projectIds: opts.project });
        if (opts.json) {
          console.log(JSON.stringify(result, null, 2));
        } else {
          printMock(result);
        }
      } catch (e: any) {
        console.error(chalk.red(e.message));
        process.exit(1);
      }
    });
}
