
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
