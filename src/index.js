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

// src/core/config.js - Configuration Manager
import fs from 'fs-extra';
import path from 'path';
import os from 'os';

export class ConfigManager {
  constructor() {
    this.globalConfigPath = path.join(os.homedir(), '.jassos', 'config.json');
    this.projectConfigPath = path.join(process.cwd(), '.jassos', 'config.json');
  }

  async init() {
    await fs.ensureDir(path.dirname(this.globalConfigPath));
    
    if (!await fs.pathExists(this.globalConfigPath)) {
      const defaultConfig = {
        active: 'openai',
        providers: {},
        history: true,
        cacheEnabled: false
      };
      await this.saveGlobalConfig(defaultConfig);
    }
  }

  async getConfig() {
    // Try project config first, fall back to global
    if (await fs.pathExists(this.projectConfigPath)) {
      return await fs.readJSON(this.projectConfigPath);
    }
    return await fs.readJSON(this.globalConfigPath);
  }

  async saveGlobalConfig(config) {
    await fs.writeJSON(this.globalConfigPath, config, { spaces: 2 });
  }

  async saveProjectConfig(config) {
    await fs.ensureDir(path.dirname(this.projectConfigPath));
    await fs.writeJSON(this.projectConfigPath, config, { spaces: 2 });
  }

  async setProvider(provider, config) {
    const currentConfig = await this.getConfig();
    currentConfig.providers[provider] = config;
    await this.saveGlobalConfig(currentConfig);
  }

  async setActiveProvider(provider) {
    const config = await this.getConfig();
    if (!config.providers[provider]) {
      throw new Error(`Provider ${provider} not configured. Run: jassos init -p ${provider}`);
    }
    config.active = provider;
    await this.saveGlobalConfig(config);
  }
}

// src/core/providers/base.js - Base Provider Class
export class BaseProvider {
  constructor(apiKey, model) {
    this.apiKey = apiKey;
    this.model = model || this.getDefaultModel();
  }

  getDefaultModel() {
    throw new Error('getDefaultModel must be implemented by subclass');
  }

  async generate(messages, options = {}) {
    throw new Error('generate must be implemented by subclass');
  }

  async *streamGenerate(messages, options = {}) {
    throw new Error('streamGenerate must be implemented by subclass');
  }
}

// src/core/providers/openai.js - OpenAI Provider
import OpenAI from 'openai';
import { BaseProvider } from './base.js';

export class OpenAIProvider extends BaseProvider {
  constructor(apiKey, model) {
    super(apiKey, model);
    this.client = new OpenAI({ apiKey });
  }

  getDefaultModel() {
    return 'gpt-4-turbo-preview';
  }

  async generate(messages, options = {}) {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 4096,
    });

    return response.choices[0]?.message?.content || '';
  }

  async *streamGenerate(messages, options = {}) {
    const stream = await this.client.chat.completions.create({
      model: this.model,
      messages: messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 4096,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) yield content;
    }
  }
}

// src/core/providers/anthropic.js - Anthropic Provider
import Anthropic from '@anthropic-ai/sdk';
import { BaseProvider } from './base.js';

export class AnthropicProvider extends BaseProvider {
  constructor(apiKey, model) {
    super(apiKey, model);
    this.client = new Anthropic({ apiKey });
  }

  getDefaultModel() {
    return 'claude-sonnet-4-5-20250929';
  }

  async generate(messages, options = {}) {
    const systemMessage = messages.find(m => m.role === 'system');
    const userMessages = messages.filter(m => m.role !== 'system');

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: options.maxTokens ?? 4096,
      system: systemMessage?.content,
      messages: userMessages,
      temperature: options.temperature ?? 0.7,
    });

    return response.content[0].type === 'text' ? response.content[0].text : '';
  }

  async *streamGenerate(messages, options = {}) {
    const systemMessage = messages.find(m => m.role === 'system');
    const userMessages = messages.filter(m => m.role !== 'system');

    const stream = await this.client.messages.create({
      model: this.model,
      max_tokens: options.maxTokens ?? 4096,
      system: systemMessage?.content,
      messages: userMessages,
      temperature: options.temperature ?? 0.7,
      stream: true,
    });

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        yield chunk.delta.text;
      }
    }
  }
}

// src/core/providers/gemini.js - Google Gemini Provider
import { GoogleGenerativeAI } from '@google/generative-ai';
import { BaseProvider } from './base.js';

export class GeminiProvider extends BaseProvider {
  constructor(apiKey, model) {
    super(apiKey, model);
    this.client = new GoogleGenerativeAI(apiKey);
  }

  getDefaultModel() {
    return 'gemini-pro';
  }

  async generate(messages, options = {}) {
    const model = this.client.getGenerativeModel({ model: this.model });
    
    // Convert messages to Gemini format
    const systemMessage = messages.find(m => m.role === 'system');
    const userMessages = messages.filter(m => m.role !== 'system');
    
    const chat = model.startChat({
      history: userMessages.slice(0, -1).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      })),
      generationConfig: {
        temperature: options.temperature ?? 0.7,
        maxOutputTokens: options.maxTokens ?? 4096,
      },
    });

    const lastMessage = userMessages[userMessages.length - 1]?.content || '';
    const prompt = systemMessage ? `${systemMessage.content}\n\n${lastMessage}` : lastMessage;
    
    const result = await chat.sendMessage(prompt);
    return result.response.text();
  }

  async *streamGenerate(messages, options = {}) {
    const model = this.client.getGenerativeModel({ model: this.model });
    
    const systemMessage = messages.find(m => m.role === 'system');
    const userMessages = messages.filter(m => m.role !== 'system');
    
    const chat = model.startChat({
      history: userMessages.slice(0, -1).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      })),
      generationConfig: {
        temperature: options.temperature ?? 0.7,
        maxOutputTokens: options.maxTokens ?? 4096,
      },
    });

    const lastMessage = userMessages[userMessages.length - 1]?.content || '';
    const prompt = systemMessage ? `${systemMessage.content}\n\n${lastMessage}` : lastMessage;
    
    const result = await chat.sendMessageStream(prompt);
    
    for await (const chunk of result.stream) {
      yield chunk.text();
    }
  }
}

// src/core/providers/factory.js - Provider Factory
import { OpenAIProvider } from './openai.js';
import { AnthropicProvider } from './anthropic.js';
import { GeminiProvider } from './gemini.js';
import { ConfigManager } from '../config.js';

export class ProviderFactory {
  static async createProvider() {
    const configManager = new ConfigManager();
    const config = await configManager.getConfig();
    
    const activeProvider = config.active;
    const providerConfig = config.providers[activeProvider];

    if (!providerConfig?.apiKey) {
      throw new Error(`No API key configured for ${activeProvider}. Run: jassos init -p ${activeProvider}`);
    }

    switch (activeProvider) {
      case 'openai':
        return new OpenAIProvider(providerConfig.apiKey, providerConfig.model);
      case 'anthropic':
        return new AnthropicProvider(providerConfig.apiKey, providerConfig.model);
      case 'gemini':
        return new GeminiProvider(providerConfig.apiKey, providerConfig.model);
      default:
        throw new Error(`Unknown provider: ${activeProvider}`);
    }
  }
}

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

// src/commands/change.js - Change Command
import { ConfigManager } from '../core/config.js';

export async function ChangeCommand(provider) {
  const configManager = new ConfigManager();
  
  try {
    await configManager.setActiveProvider(provider);
    console.log(`✓ Switched to ${provider}`);
  } catch (error) {
    console.error(`✗ ${error.message}`);
    process.exit(1);
  }
}

// src/commands/run.js - Run Command (Code Generation)
import { ProviderFactory } from '../core/providers/factory.js';
import { CodeGenerator } from '../core/generator.js';
import ora from 'ora';

export async function RunCommand(prompt, options) {
  const spinner = ora('Generating code...').start();
  
  try {
    const provider = await ProviderFactory.createProvider();
    const generator = new CodeGenerator(provider);
    
    await generator.generate(prompt, {
      model: options.model,
      directory: process.cwd()
    });
    
    spinner.succeed('Code generation complete!');
  } catch (error) {
    spinner.fail('Generation failed');
    console.error(`✗ ${error.message}`);
    process.exit(1);
  }
}

// src/commands/start.js - Start Command (Interactive Shell)
import readline from 'readline';
import { ProviderFactory } from '../core/providers/factory.js';
import chalk from 'chalk';

export async function StartCommand(options) {
  const provider = await ProviderFactory.createProvider();
  const messages = [];
  
  console.log(chalk.blue('Jassos Interactive Shell'));
  console.log(chalk.gray('Type your message and press Enter. Type "exit" to quit.\n'));
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: chalk.green('you> ')
  });

  rl.prompt();

  rl.on('line', async (input) => {
    const userInput = input.trim();
    
    if (userInput === 'exit') {
      rl.close();
      return;
    }
    
    if (!userInput) {
      rl.prompt();
      return;
    }

    messages.push({ role: 'user', content: userInput });
    
    process.stdout.write(chalk.blue('assistant> '));
    
    try {
      let response = '';
      for await (const chunk of provider.streamGenerate(messages)) {
        process.stdout.write(chunk);
        response += chunk;
      }
      
      messages.push({ role: 'assistant', content: response });
      console.log('\n');
    } catch (error) {
      console.error(chalk.red(`\nError: ${error.message}\n`));
    }
    
    rl.prompt();
  });

  rl.on('close', () => {
    console.log(chalk.gray('\nGoodbye!'));
    process.exit(0);
  });
}

// src/core/generator.js - Code Generator
import fs from 'fs-extra';
import path from 'path';

export class CodeGenerator {
  constructor(provider) {
    this.provider = provider;
  }

  async generate(prompt, options = {}) {
    const systemPrompt = `You are a code generation assistant. Generate complete, production-ready code based on the user's request.

Output format:
1. Start with a brief description
2. Then output files in this format:

FILE: path/to/file.ext
\`\`\`language
// code here
\`\`\`

Example:
FILE: package.json
\`\`\`json
{
  "name": "my-app"
}
\`\`\`

FILE: src/index.js
\`\`\`javascript
console.log('Hello');
\`\`\`

Generate all necessary files for a complete, working project.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ];

    const response = await this.provider.generate(messages, {
      maxTokens: 8000
    });

    await this.parseAndWriteFiles(response, options.directory || process.cwd());
  }

  async parseAndWriteFiles(response, baseDir) {
    const filePattern = /FILE:\s*(.+?)\n```(\w+)?\n([\s\S]*?)```/g;
    let match;
    const filesCreated = [];

    while ((match = filePattern.exec(response)) !== null) {
      const [, filePath, , content] = match;
      const fullPath = path.join(baseDir, filePath.trim());
      
      await fs.ensureDir(path.dirname(fullPath));
      await fs.writeFile(fullPath, content.trim(), 'utf-8');
      
      filesCreated.push(filePath.trim());
      console.log(`Created: ${filePath.trim()}`);
    }

    if (filesCreated.length === 0) {
      console.log('\nResponse:\n', response);
    }

    return filesCreated;
  }
}