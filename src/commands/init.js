
// src/commands/init.js - Init Command
import inquirer from 'inquirer';
import { ConfigManager } from '../core/config.js';

export async function InitCommand(options) {
  const configManager = new ConfigManager();
  await configManager.init();

  const provider = options.provider || (await inquirer.prompt([{
    type: 'list',
    name: 'provider',
    message: 'Select LLM provider:',
    choices: ['openai', 'anthropic', 'gemini', 'ollama']
  }])).provider;

  const { apiKey } = await inquirer.prompt([{
    type: 'password',
    name: 'apiKey',
    message: `Enter ${provider} API key:`,
    mask: '*'
  }]);

  await configManager.setProvider(provider, { apiKey });
  await configManager.setActiveProvider(provider);

  console.log(`✓ Configured ${provider} as active provider`);
}