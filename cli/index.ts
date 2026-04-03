#!/usr/bin/env node
import { Command } from 'commander';
import { registerConfig } from './commands/config';
import { registerList } from './commands/list';
import { registerGet } from './commands/get';
import { registerMock } from './commands/mock';
import { registerTypes } from './commands/types';
import { registerSearch } from './commands/search';

const program = new Command();

program
  .name('yapi')
  .description('YApi CLI — core interface querying, mock data, and TS type generation')
  .version('1.0.0');

registerConfig(program);
registerList(program);
registerGet(program);
registerMock(program);
registerTypes(program);
registerSearch(program);

program.parse(process.argv);
