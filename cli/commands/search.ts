import { Command } from 'commander';
import chalk from 'chalk';
import { printSearch } from '../core/format';
import { searchInterfaces } from '../core/service';

export function registerSearch(program: Command): void {
  program
    .command('search <keyword>')
    .alias('s')
    .description('Search interfaces by title or path')
    .option('-p, --project <ids>', 'Project ID or comma-separated project IDs')
    .option('--json', 'Output JSON')
    .action(async (keyword: string, opts) => {
      try {
        const matches = await searchInterfaces({ keyword, projectIds: opts.project });
        if (matches.length === 0) {
          console.log(chalk.yellow(`No interfaces found matching "${keyword}"`));
          return;
        }

        if (opts.json) {
          console.log(JSON.stringify(matches, null, 2));
          return;
        }

        printSearch(matches);
      } catch (e: any) {
        console.error(chalk.red(e.message));
        process.exit(1);
      }
    });
}
