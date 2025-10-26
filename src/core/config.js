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