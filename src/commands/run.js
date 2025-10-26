
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