import chalk from 'chalk';
import { LoadedConfig } from '../config';
import { CompactInterfaceDetail, ListInterfacesResult, MockResult, SearchMatch, TypeGenerationResult } from '../types';

export function printConfig(config: LoadedConfig): void {
  console.log(chalk.bold('Config file:'), config.path);
  console.log(chalk.bold('Active projectIds:'), config.config.activeProjectIds.join(', '));
  console.log(chalk.bold('Projects:'));

  for (const project of config.config.projects) {
    const baseUrl = project.baseUrl || config.config.baseUrl || '(missing baseUrl)';
    console.log(`  ${chalk.bold(project.projectId)}  ${chalk.gray(project.projectName)}  ${chalk.cyan(baseUrl)}`);
  }
}

export function printList(results: ListInterfacesResult[]): void {
  for (const result of results) {
    console.log(chalk.bold(`\nProject: ${result.project.projectId} ${chalk.gray(`(${result.project.projectName})`)} ${chalk.cyan(result.project.baseUrl)}`));
    console.log(chalk.gray(`YApi: ${result.projectInfo.name} ${result.projectInfo.basepath || '/'}`));

    for (const category of result.categories) {
      console.log(chalk.cyan(`[${category.category}]`));
      for (const iface of category.interfaces) {
        const method = iface.method.toUpperCase().padEnd(7);
        const status = iface.status === 'done' ? chalk.green('✓') : chalk.yellow('○');
        console.log(`  ${status} ${chalk.bold(method)} ${iface.path.padEnd(40)} ${chalk.gray(iface.title)} ${chalk.gray(`#${iface.id}`)}`);
      }
      console.log();
    }
  }
}

export function printSearch(matches: SearchMatch[]): void {
  if (matches.length === 0) {
    console.log(chalk.yellow('No interfaces found'));
    return;
  }

  console.log(chalk.bold(`\nFound ${matches.length} interface(s):\n`));
  for (const match of matches) {
    const method = match.method.toUpperCase().padEnd(7);
    const status = match.status === 'done' ? chalk.green('✓') : chalk.yellow('○');
    console.log(`  ${status} ${chalk.bold(method)} ${match.path.padEnd(40)} ${chalk.gray(match.title)} ${chalk.gray(`#${match.id}`)}`);
    console.log(`    ${chalk.gray(`[${match.project.projectId}/${match.category}] ${match.project.projectName}`)}`);
  }
  console.log();
}

export function printInterface(detail: CompactInterfaceDetail): void {
  const method = detail.method.toUpperCase();
  const statusColor = detail.status === 'done' ? chalk.green : chalk.yellow;
  console.log(`\n${chalk.bold(method)} ${chalk.cyan(detail.path)}  ${statusColor(`[${detail.status}]`)}  ${chalk.gray(`#${detail.id}`)}`);
  console.log(chalk.bold(`${detail.title}  ${chalk.gray(`[${detail.project.projectId}] ${detail.project.projectName}`)}`));
  if (detail.desc) console.log(chalk.gray(detail.desc));

  if (detail.pathParams?.length) {
    console.log(chalk.bold('\nPath Params:'));
    for (const param of detail.pathParams) console.log(`  :${param.name}  ${chalk.gray(param.desc || '')}`);
  }

  if (detail.query?.length) {
    console.log(chalk.bold('\nQuery:'));
    for (const query of detail.query) {
      const required = query.required ? chalk.red('*') : ' ';
      console.log(`  ${required} ${query.name}${query.example ? `=${query.example}` : ''}  ${chalk.gray(query.desc || '')}`);
    }
  }

  if (detail.headers?.length) {
    console.log(chalk.bold('\nHeaders:'));
    for (const header of detail.headers) {
      const required = header.required ? chalk.red('*') : ' ';
      console.log(`  ${required} ${header.name}  ${chalk.gray(header.desc || '')}`);
    }
  }

  if (detail.body?.length) {
    console.log(chalk.bold(`\nBody (${detail.bodyType}):`));
    for (const field of detail.body) {
      const required = field.required ? chalk.red('*') : ' ';
      console.log(`  ${required} ${field.name}: ${chalk.cyan(field.type)}${field.example ? `  e.g. ${field.example}` : ''}  ${chalk.gray(field.desc || '')}`);
    }
  } else if (detail.bodyFields?.length) {
    console.log(chalk.bold('\nBody (JSON):'));
    for (const field of detail.bodyFields) {
      const required = field.required ? chalk.red('*') : ' ';
      console.log(`  ${required} ${field.name}: ${chalk.cyan(field.type)}  ${chalk.gray(field.desc || '')}`);
    }
  } else if (detail.bodySchema) {
    console.log(chalk.bold('\nBody Schema:'));
    console.log(JSON.stringify(detail.bodySchema, null, 2));
  }

  if (detail.responseFields?.length) {
    console.log(chalk.bold('\nResponse:'));
    for (const field of detail.responseFields) {
      console.log(`  ${field.name}: ${chalk.cyan(field.type)}  ${chalk.gray(field.desc || '')}`);
    }
  } else if (detail.responseSchema) {
    console.log(chalk.bold('\nResponse Schema:'));
    console.log(JSON.stringify(detail.responseSchema, null, 2));
  }

  console.log();
}

export function printMock(result: MockResult): void {
  console.log(JSON.stringify(result.mock, null, 2));
}

export function printTypes(result: TypeGenerationResult): void {
  console.log(result.code);
}
