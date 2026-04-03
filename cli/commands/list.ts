import { Command } from 'commander';
import chalk from 'chalk';
import { printList } from '../core/format';
import { listInterfaces } from '../core/service';

export function registerList(program: Command): void {
  program
    .command('list')
    .alias('ls')
    .description('List interfaces in one or more projects')
    .option('-p, --project <ids>', 'Project ID or comma-separated project IDs')
    .option('-c, --cat <catName>', 'Filter by category name')
    .option('--json', 'Output JSON')
    .action(async (opts) => {
      try {
        const results = await listInterfaces({
          projectIds: opts.project,
          category: opts.cat,
        });
        if (opts.json) {
          console.log(JSON.stringify(results, null, 2));
        } else {
          printList(results);
        }
      } catch (e: any) {
        console.error(chalk.red(e.message));
        process.exit(1);
      }
    });
}
