#!/usr/bin/env node
import { Command } from 'commander';
import {
  generateMockData,
  generateTypes,
  getInterfaceDetails,
  searchInterfaces,
} from '../cli/public-api';

const program = new Command();

program
  .name('yapi-skill')
  .description('Skill-friendly YApi wrapper built on top of the CLI core')
  .version('1.0.0');

program
  .command('discover <keyword>')
  .description('Search interfaces and return a short agent-friendly shortlist')
  .option('-p, --project <ids>', 'Project ID or comma-separated project IDs')
  .option('--limit <n>', 'Maximum matches', '8')
  .action(async (keyword: string, opts) => {
    const matches = await searchInterfaces({ keyword, projectIds: opts.project });
    const limit = Number(opts.limit) > 0 ? Number(opts.limit) : 8;
    const shortlist = matches.slice(0, limit).map(match => ({
      projectId: match.project.projectId,
      projectName: match.project.projectName,
      id: match.id,
      method: match.method,
      path: match.path,
      title: match.title,
      category: match.category,
    }));

    console.log(JSON.stringify({
      keyword,
      count: matches.length,
      shortlist,
      guidance: 'Use yapi-skill inspect <idOrPath> --project <projectId> for the next step.',
    }, null, 2));
  });

program
  .command('inspect <idOrPath>')
  .description('Return compact interface details for agent use')
  .option('-p, --project <id>', 'Single project ID')
  .option('--full', 'Include raw schemas')
  .action(async (idOrPath: string, opts) => {
    const detail = await getInterfaceDetails({ idOrPath, projectIds: opts.project, full: opts.full });
    console.log(JSON.stringify(detail, null, 2));
  });

program
  .command('types <idOrPath>')
  .description('Return generated TypeScript types for agent use')
  .option('-p, --project <id>', 'Single project ID')
  .option('--name <typeName>', 'Override base type name')
  .action(async (idOrPath: string, opts) => {
    const result = await generateTypes({ idOrPath, projectIds: opts.project, name: opts.name });
    console.log(JSON.stringify(result, null, 2));
  });

program
  .command('mock <idOrPath>')
  .description('Return mock response data for agent use')
  .option('-p, --project <id>', 'Single project ID')
  .action(async (idOrPath: string, opts) => {
    const result = await generateMockData({ idOrPath, projectIds: opts.project });
    console.log(JSON.stringify(result, null, 2));
  });

program.parseAsync(process.argv).catch(error => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
