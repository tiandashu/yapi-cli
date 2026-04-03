import { Command } from 'commander';
import chalk from 'chalk';
import { printInterface } from '../core/format';
import { getInterfaceDetails } from '../core/service';

export function registerGet(program: Command): void {
  program
    .command('get <idOrPath>')
    .description('Get interface details (compact format for LLM)')
    .option('-p, --project <id>', 'Single project ID')
    .option('--full', 'Show full raw response body schemas')
    .option('--json', 'Output JSON')
    .action(async (idOrPath: string, opts) => {
      try {
        const detail = await getInterfaceDetails({
          idOrPath,
          projectIds: opts.project,
          full: opts.full,
        });
        if (opts.json) {
          console.log(JSON.stringify(detail, null, 2));
          return;
        }

        printInterface(detail);
      } catch (e: any) {
        console.error(chalk.red(e.message));
        process.exit(1);
      }
    });
}
