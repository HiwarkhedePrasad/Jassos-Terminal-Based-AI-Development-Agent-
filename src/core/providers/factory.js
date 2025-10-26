
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
