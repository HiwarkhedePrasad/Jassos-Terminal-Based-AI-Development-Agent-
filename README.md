# 🚀 Jassos - Terminal-Based AI Development Assistant

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)

**Supercharge your development workflow with AI-powered code generation directly from your terminal**

[Installation](#-installation) • [Usage](#-usage) • [Features](#-features) • [Contributing](#-contributing)

</div>

---

## 🎯 What is Jassos?

Jassos is a powerful CLI tool that brings multiple Large Language Models (LLMs) directly into your terminal. Generate entire projects, modify code, or chat with AI assistants - all without leaving your command line.

### Why Jassos?

- ⚡ **Fast** - No context switching between browser tabs
- 🔄 **Multi-Provider** - Switch between OpenAI, Claude, and Gemini
- 🎨 **Smart Generation** - Creates complete, production-ready code
- 💬 **Interactive Shell** - Real-time streaming conversations
- 🔧 **Developer-First** - Built by developers, for developers

---

## 📦 Installation

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn

### Quick Install

```bash
# Clone the repository
git clone https://github.com/HiwarkhedePrasad/Jassos-Terminal-Based-AI-Development-Agent-.git

# Navigate to directory
cd jassos

# Install dependencies
npm install

# Link globally (makes 'jassos' command available)
npm link
```

### Verify Installation

```bash
jassos --version
```

---

## 🚀 Quick Start

### 1. Initialize with your preferred AI provider

```bash
jassos init
```

You'll be prompted to select a provider and enter your API key:
- **OpenAI** (GPT-4, GPT-3.5)
- **Anthropic** (Claude Sonnet, Opus)
- **Google** (Gemini Pro)

### 2. Generate your first project

```bash
mkdir my-app && cd my-app
jassos run "create a todo app with React and TypeScript"
```

### 3. Start an interactive session

```bash
jassos start
```

---

## 💡 Usage

### Command Reference

#### `jassos init`
Initialize Jassos and configure LLM providers

```bash
# Interactive setup
jassos init

# Quick setup with specific provider
jassos init -p openai
jassos init -p anthropic
jassos init -p gemini
```

#### `jassos run <prompt>`
Generate code or entire projects based on natural language prompts

```bash
# Generate a web app
jassos run "create a landing page with Tailwind CSS"

# Generate backend API
jassos run "build a REST API with Express and MongoDB"

# Generate Python scripts
jassos run "create a web scraper with Beautiful Soup"

# Generate with specific model
jassos run "build a chat app" -m gpt-4
```

#### `jassos change <provider>`
Switch between configured AI providers

```bash
jassos change openai
jassos change anthropic
jassos change gemini
```

#### `jassos start`
Launch interactive AI shell for conversations and iterative development

```bash
jassos start

# Inside the shell:
you> create a user authentication component
assistant> [generates code...]

you> add input validation
assistant> [updates code...]

you> exit
```

---

## 🎨 Features

### Multi-Provider Support
- **OpenAI** - GPT-4 Turbo, GPT-3.5
- **Anthropic** - Claude Sonnet 4.5, Claude Opus
- **Google** - Gemini Pro

### Smart Code Generation
- Automatic file structure creation
- Production-ready boilerplate
- Best practices built-in
- Multiple framework support

### Interactive Development
- Real-time streaming responses
- Conversation history
- Context-aware suggestions
- File modification support

### Configuration Management
- Global configuration (`~/.jassos/config.json`)
- Per-project settings
- Secure API key storage
- Easy provider switching

---

## 📖 Examples

### Example 1: Full-Stack Application

```bash
mkdir my-saas-app
cd my-saas-app

jassos run "create a SaaS starter with Next.js 14, Prisma, PostgreSQL, 
authentication with NextAuth, Stripe integration, and Tailwind CSS"
```

### Example 2: Python Data Pipeline

```bash
jassos run "create a data pipeline that scrapes HackerNews, 
processes with pandas, and stores in SQLite"
```

### Example 3: Interactive Feature Addition

```bash
jassos start

you> I have a React app. Add a dark mode toggle component
you> Now add localStorage persistence for the theme
you> Create unit tests for the component using Jest
you> exit
```

### Example 4: Multi-File Generation

```bash
jassos run "create a microservices architecture with:
- User service (Node.js + Express)
- Product service (Python + FastAPI)
- Docker compose file
- Nginx reverse proxy config
- README with setup instructions"
```

---

## ⚙️ Configuration

### Configuration File Location

- **Global Config**: `~/.jassos/config.json`
- **Project Config**: `.jassos/config.json` (optional)

### Example Configuration

```json
{
  "active": "anthropic",
  "providers": {
    "openai": {
      "apiKey": "sk-...",
      "model": "gpt-4-turbo-preview"
    },
    "anthropic": {
      "apiKey": "sk-ant-...",
      "model": "claude-sonnet-4-5-20250929"
    },
    "gemini": {
      "apiKey": "AIza...",
      "model": "gemini-pro"
    }
  },
  "history": true,
  "cacheEnabled": false
}
```

---

## 🔑 Getting API Keys

| Provider | Get API Key | Pricing |
|----------|-------------|---------|
| OpenAI | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) | Pay-as-you-go |
| Anthropic | [console.anthropic.com](https://console.anthropic.com/) | Pay-as-you-go |
| Google Gemini | [makersuite.google.com](https://makersuite.google.com/app/apikey) | Free tier available |

---

## 🛠️ Development

### Project Structure

```
jassos/
├── src/
│   ├── index.js              # CLI entry point
│   ├── commands/             # Command implementations
│   │   ├── init.js
│   │   ├── change.js
│   │   ├── run.js
│   │   └── start.js
│   └── core/
│       ├── config.js         # Configuration manager
│       ├── generator.js      # Code generation
│       └── providers/        # LLM integrations
│           ├── openai.js
│           ├── anthropic.js
│           ├── gemini.js
│           └── factory.js
└── package.json
```

### Running in Development

```bash
npm run dev
```

---

## 🗺️ Roadmap

- [ ] **Plugin System** - Extend functionality with community plugins
- [ ] **Ollama Integration** - Support for local LLM models
- [ ] **History Persistence** - Save and restore conversation sessions
- [ ] **Template Library** - Pre-built project templates
- [ ] **Git Integration** - Auto-commit generated code
- [ ] **Multi-File Context** - Analyze entire codebases
- [ ] **Cloud Sync** - Sync configurations across devices
- [ ] **Team Workspaces** - Collaborative development

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup

```bash
git clone https://github.com/HiwarkhedePrasad/Jassos-Terminal-Based-AI-Development-Agent-.git
cd jassos
npm install
npm link
```

---

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- OpenAI for GPT models
- Anthropic for Claude
- Google for Gemini
- The open-source community

---

## 📧 Support

- **Issues**: [GitHub Issues](https://github.com/HiwarkhedePrasad/Jassos-Terminal-Based-AI-Development-Agent-/issues)
- **Discussions**: [GitHub Discussions](https://github.com/HiwarkhedePrasad/Jassos-Terminal-Based-AI-Development-Agent-/discussions)

---

<div align="center">

**Made with ❤️ by [Prasad Hiwarkhed](https://github.com/HiwarkhedePrasad)**

⭐ Star this repo if you find it helpful!

</div>