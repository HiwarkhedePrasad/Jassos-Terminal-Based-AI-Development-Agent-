
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
