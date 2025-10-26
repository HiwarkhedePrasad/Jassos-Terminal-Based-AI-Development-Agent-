
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
