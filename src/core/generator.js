
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