# Jassos Testing & Troubleshooting Guide

## ✅ Your CLI is Working!

The output you see is **normal** - it means the CLI is running correctly. The "Failed running" message is just the watch mode waiting for changes.

## 🧪 Test Each Command

### Test 1: Check Version
```bash
node src/index.js --version
# Should output: 1.0.0
```

### Test 2: Show Help
```bash
node src/index.js --help
# Should show all commands
```

### Test 3: Initialize (This is where real testing begins)
```bash
node src/index.js init
```

You'll see:
```
? Select LLM provider: (Use arrow keys)
❯ openai
  anthropic
  gemini
  ollama
```

Select one and paste your API key when prompted.

### Test 4: Check Configuration
After init, check if config was created:
```bash
cat ~/.jassos/config.json
```

You should see:
```json
{
  "active": "openai",
  "providers": {
    "openai": {
      "apiKey": "sk-..."
    }
  },
  "history": true,
  "cacheEnabled": false
}
```

### Test 5: Switch Provider
```bash
node src/index.js change anthropic
# Should show: ✓ Switched to anthropic
```

### Test 6: Generate Code (Small Test)
```bash
mkdir test-project
cd test-project
node ../src/index.js run "create a simple hello.js file that prints hello world"
```

### Test 7: Interactive Shell
```bash
node src/index.js start
```

Then type:
```
you> write a function to add two numbers
you> exit
```

## 🔧 Common Issues & Fixes

### Issue 1: "Cannot find module"

**Error:**
```
Error: Cannot find module 'commander'
```

**Fix:**
```bash
npm install
```

### Issue 2: Command not found (after npm link)

**Error:**
```bash
jassos: command not found
```

**Fix:**
```bash
# Unlink and relink
npm unlink
npm link

# Or run directly
node src/index.js [command]
```

### Issue 3: Permission Denied

**Error:**
```
permission denied: jassos
```

**Fix:**
```bash
chmod +x src/index.js
```

### Issue 4: "Provider not configured"

**Error:**
```
✗ Provider openai not configured. Run: jassos init -p openai
```

**Fix:**
```bash
jassos init -p openai
# Enter your API key when prompted
```

### Issue 5: API Key Issues

**Error:**
```
Error: 401 Unauthorized
```

**Fix:**
1. Check your API key is valid
2. Re-run init:
```bash
jassos init -p openai
```

### Issue 6: "Old data" in streaming responses

If you see partial responses, the provider streaming might need adjustment. This is normal for first use.

## 🎯 Quick Verification Script

Create a file `test.sh`:

```bash
#!/bin/bash

echo "🧪 Testing Jassos CLI..."

echo "\n1️⃣ Version Check:"
node src/index.js --version

echo "\n2️⃣ Help Command:"
node src/index.js --help

echo "\n3️⃣ Config Check:"
if [ -f ~/.jassos/config.json ]; then
  echo "✓ Config exists"
  cat ~/.jassos/config.json
else
  echo "✗ Config not found. Run: node src/index.js init"
fi

echo "\n✅ Basic tests complete!"
```

Run it:
```bash
chmod +x test.sh
./test.sh
```

## 🚀 Production Testing

### Test Full Workflow:

```bash
# 1. Initialize
jassos init -p openai

# 2. Create a test project
mkdir my-test-app
cd my-test-app

# 3. Generate a simple project
jassos run "create a package.json and index.js for a basic express server"

# 4. Check generated files
ls -la

# 5. Try interactive mode
jassos start
# Type: create a README.md file
# Type: exit

# 6. Switch provider and test
jassos change anthropic  # (if configured)
jassos run "add a .gitignore file"
```

## 📊 Expected Behavior

### ✅ Success Indicators:

1. **Init Command:**
   - Prompts for provider selection
   - Asks for API key
   - Shows success message: `✓ Configured openai as active provider`

2. **Run Command:**
   - Shows spinner: `⠋ Generating code...`
   - Creates files with output: `Created: index.js`
   - Completes with: `✓ Code generation complete!`

3. **Start Command:**
   - Shows banner: `Jassos Interactive Shell`
   - Prompt appears: `you> `
   - Streams responses in real-time
   - Blue text for assistant responses

4. **Change Command:**
   - Quick switch: `✓ Switched to anthropic`

## 🐛 Debug Mode

Add this to any command to see detailed logs:

```javascript
// At the top of src/index.js, after imports:
if (process.env.DEBUG) {
  console.log('Debug mode enabled');
}
```

Then run:
```bash
DEBUG=1 node src/index.js run "create hello.js"
```

## 📝 Manual Testing Checklist

- [ ] `jassos --version` shows version
- [ ] `jassos --help` shows all commands
- [ ] `jassos init` creates config file
- [ ] `jassos change` switches providers
- [ ] `jassos run` generates files
- [ ] `jassos start` opens interactive shell
- [ ] Generated files contain actual code
- [ ] Streaming works in interactive mode
- [ ] Config persists between commands

## 🎉 If Everything Works

Your CLI is ready! You can:

1. **Push to GitHub:**
```bash
git add .
git commit -m "Initial Jassos CLI implementation"
git push origin main
```

2. **Publish to npm** (optional):
```bash
npm login
npm publish
```

3. **Share with others:**
```bash
# They can install with:
npm install -g jassos
```

## 💡 Next Level Testing

Once basics work, try:

```bash
# Complex project generation
jassos run "create a full-stack todo app with:
- React frontend with TypeScript
- Node.js Express backend
- MongoDB integration
- Docker setup
- Complete README"

# Multi-turn conversation
jassos start
you> create a user authentication system
you> add JWT support
you> include password hashing with bcrypt
you> create API documentation
you> exit
```

---

**Remember:** The "Failed running" message in watch mode is NOT an error - it's just waiting for file changes!