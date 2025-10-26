
// src/core/providers/gemini.js - Google Gemini Provider
import { GoogleGenerativeAI } from '@google/generative-ai';
import { BaseProvider } from './base.js';

export class GeminiProvider extends BaseProvider {
  constructor(apiKey, model) {
    super(apiKey, model);
    this.client = new GoogleGenerativeAI(apiKey);
  }

  getDefaultModel() {
    return 'gemini-2.5-flash';
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
