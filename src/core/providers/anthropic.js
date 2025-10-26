

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
