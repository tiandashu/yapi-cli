import { Command } from 'commander';
import chalk from 'chalk';
import { printTypes } from '../core/format';
import { generateTypes } from '../core/service';

export function registerTypes(program: Command): void {
  program
    .command('types <idOrPath>')
    .description('Generate TypeScript types from interface schema')
    .option('-p, --project <id>', 'Single project ID')
    .option('--name <typeName>', 'Override generated type name')
    .option('--json', 'Output JSON envelope (agent-friendly)')
    .action(async (idOrPath: string, opts) => {
      try {
        const result = await generateTypes({
          idOrPath,
          projectIds: opts.project,
          name: opts.name,
        });
        if (opts.json) {
          console.log(JSON.stringify(result, null, 2));
          return;
        }
        printTypes(result);
      } catch (e: any) {
        console.error(chalk.red(e.message));
        process.exit(1);
      }
    });
}
