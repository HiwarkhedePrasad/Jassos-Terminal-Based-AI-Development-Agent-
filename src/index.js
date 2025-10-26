// src/index.js - Main CLI Entry Point
import { Command } from 'commander';
import { InitCommand } from './commands/init.js';
import { ChangeCommand } from './commands/change.js';
import { RunCommand } from './commands/run.js';
import { StartCommand } from './commands/start.js';

const program = new Command();

program
  .name('jassos')
  .description('Terminal-based AI development assistant')
  .version('0.1.0');

// Initialize configuration
program
  .command('init')
  .description('Initialize Jassos and configure LLM providers')
  .option('-p, --provider <provider>', 'Specify provider (openai, anthropic, gemini)')
  .action(InitCommand);

// Switch active provider
program
  .command('change <provider>')
  .description('Switch active LLM provider')
  .action(ChangeCommand);

// Generate code/project
program
  .command('run <prompt>')
  .description('Generate code or project based on prompt')
  .option('-m, --model <model>', 'Specify model to use')
  .action(RunCommand);

// Interactive shell
program
  .command('start')
  .description('Start interactive AI shell')
  .option('-c, --continue', 'Continue previous session')
  .action(StartCommand);

program.parse();




