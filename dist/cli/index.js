#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const config_1 = require("./commands/config");
const list_1 = require("./commands/list");
const get_1 = require("./commands/get");
const mock_1 = require("./commands/mock");
const types_1 = require("./commands/types");
const search_1 = require("./commands/search");
const program = new commander_1.Command();
program
    .name('yapi')
    .description('YApi CLI — core interface querying, mock data, and TS type generation')
    .version('1.0.0');
(0, config_1.registerConfig)(program);
(0, list_1.registerList)(program);
(0, get_1.registerGet)(program);
(0, mock_1.registerMock)(program);
(0, types_1.registerTypes)(program);
(0, search_1.registerSearch)(program);
program.parse(process.argv);
