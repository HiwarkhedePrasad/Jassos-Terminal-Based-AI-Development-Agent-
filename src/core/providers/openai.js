
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
