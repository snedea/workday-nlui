# Installation Guide

## Prerequisites

### System Requirements
- **Node.js**: Version 18.0 or higher ([Download](https://nodejs.org/))
- **npm**: Version 8.0 or higher (comes with Node.js)
- **Git**: For cloning the repository ([Download](https://git-scm.com/))

### LLM Provider Account
You'll need API access to one of the following:
- **OpenAI API** ([Get API Key](https://platform.openai.com/api-keys))
- **Azure OpenAI Service** ([Get Started](https://azure.microsoft.com/en-us/products/ai-services/openai-service))

## Quick Start (5 minutes)

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/snedea/workday-nlui.git
cd workday-nlui

# Install dependencies
npm install
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your preferred editor
nano .env  # or code .env, vim .env, etc.
```

### 3. Add Your API Keys

**For OpenAI:**
```env
OPENAI_PROVIDER=openai
OPENAI_API_KEY=sk-your-actual-api-key-here
OPENAI_API_MODEL=gpt-4o-mini
```

**For Azure OpenAI:**
```env
OPENAI_PROVIDER=azure
AZURE_OPENAI_API_KEY=your-azure-api-key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_DEPLOYMENT=gpt-4o-mini
AZURE_OPENAI_API_VERSION=2024-02-15-preview
```

### 4. Start the Application

```bash
npm run dev
```

**🎉 Open http://localhost:5173** in your browser!

## Detailed Installation

### Development Setup

1. **Verify Node.js Installation**
   ```bash
   node --version  # Should be 18.0+
   npm --version   # Should be 8.0+
   ```

2. **Clone Repository**
   ```bash
   git clone https://github.com/snedea/workday-nlui.git
   cd workday-nlui
   ```

3. **Install Dependencies**
   ```bash
   # Using npm (recommended)
   npm install

   # Or using yarn
   yarn install

   # Or using pnpm
   pnpm install
   ```

4. **Environment Configuration**

   Copy the example file:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your API credentials:
   ```env
   # Choose your provider
   OPENAI_PROVIDER=openai  # or 'azure'

   # OpenAI Configuration
   OPENAI_API_KEY=sk-your-key-here
   OPENAI_API_BASE=https://api.openai.com/v1  # Optional, defaults to OpenAI
   OPENAI_API_MODEL=gpt-4o-mini               # Optional, defaults to gpt-4o-mini

   # Azure OpenAI Configuration (if using azure provider)
   AZURE_OPENAI_API_KEY=your-azure-key
   AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
   AZURE_OPENAI_API_VERSION=2024-02-15-preview
   AZURE_OPENAI_DEPLOYMENT=gpt-4o-mini
   ```

5. **Start Development Servers**
   ```bash
   npm run dev
   ```

   This starts two servers:
   - **Frontend (Vite)**: http://localhost:5173
   - **Backend (Express)**: http://localhost:8787

### Production Setup

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Start Production Server**
   ```bash
   npm start
   ```

3. **Environment Variables**

   For production, set environment variables directly or use a `.env` file:
   ```bash
   # Set production environment
   NODE_ENV=production
   PORT=8787  # Optional, defaults to 8787
   ```

### Alternative Installation Methods

#### Using Docker (Future Release)

```bash
# Build Docker image
docker build -t workday-nlui .

# Run with environment file
docker run --env-file .env -p 5173:5173 -p 8787:8787 workday-nlui
```

#### Using PM2 (Production)

```bash
# Install PM2
npm install -g pm2

# Build the app
npm run build

# Start with PM2
pm2 start dist-server/server.js --name workday-nlui

# Save PM2 configuration
pm2 save
pm2 startup
```

## Configuration Reference

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENAI_PROVIDER` | No | `openai` | Provider: `openai` or `azure` |
| `OPENAI_API_KEY` | Yes* | - | OpenAI API key |
| `OPENAI_API_BASE` | No | `https://api.openai.com/v1` | OpenAI API base URL |
| `OPENAI_API_MODEL` | No | `gpt-4o-mini` | OpenAI model name |
| `AZURE_OPENAI_API_KEY` | Yes** | - | Azure OpenAI API key |
| `AZURE_OPENAI_ENDPOINT` | Yes** | - | Azure OpenAI endpoint |
| `AZURE_OPENAI_DEPLOYMENT` | Yes** | - | Azure OpenAI deployment name |
| `AZURE_OPENAI_API_VERSION` | No | `2024-02-15-preview` | Azure API version |
| `PORT` | No | `8787` | Backend server port |
| `NODE_ENV` | No | `development` | Environment mode |

*Required when `OPENAI_PROVIDER=openai`
**Required when `OPENAI_PROVIDER=azure`

### Port Configuration

By default, the application uses:
- **Frontend**: Port 5173 (Vite dev server)
- **Backend**: Port 8787 (Express API server)

To change the backend port:
```env
PORT=3000  # Change backend to port 3000
```

To change the frontend port:
```bash
npm run dev:client -- --port 3001
```

## Verification

### Health Check

Test the backend is running correctly:
```bash
curl http://localhost:8787/api/health
```

Expected response:
```json
{
  "status": "ok",
  "provider": "openai",
  "configured": true
}
```

### Test API Generation

Test the LLM integration:
```bash
curl -X POST http://localhost:8787/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Create a simple Worker profile"}'
```

### Frontend Access

Open http://localhost:5173 and verify you see:
- Workday Prompt Library header
- Search bar and category tabs
- Library cards with objects, fields, controls, icons
- Prompt composer on the right side

## Troubleshooting

### Common Issues

#### 1. "Command not found: npm"
**Solution:** Install Node.js from https://nodejs.org/

#### 2. "EACCES: permission denied"
**Solution:** Fix npm permissions:
```bash
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

#### 3. "Port 5173 already in use"
**Solution:** Kill the process or use a different port:
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev:client -- --port 3001
```

#### 4. "Authentication failed"
**Solution:** Check your API keys:
- Verify the API key format is correct
- Ensure the key has proper permissions
- Check if the key is active and not expired

#### 5. "Module not found" errors
**Solution:** Clear and reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

#### 6. "CORS" errors in browser
**Solution:** Ensure both servers are running:
```bash
# Check if both servers started
npm run dev

# Look for both messages:
# ➜  Local:   http://localhost:5173/
# Server running on port 8787
```

### Debug Mode

Enable detailed logging:
```env
NODE_ENV=development
DEBUG=workday-nlui:*
```

### Getting Help

1. **Check the logs** in your terminal where you ran `npm run dev`
2. **Open browser DevTools** (F12) and check the Console tab
3. **Verify environment** variables are set correctly
4. **Test the health endpoint** to ensure backend connectivity
5. **Check firewall/antivirus** settings if having connection issues

### System-Specific Notes

#### Windows
- Use PowerShell or Command Prompt
- Paths use backslashes: `\`
- May need to enable execution policy for scripts

#### macOS
- Use Terminal or iTerm
- Xcode Command Line Tools may be required: `xcode-select --install`

#### Linux
- Use your preferred terminal
- May need to install build tools: `sudo apt-get install build-essential`

---

## Next Steps

Once installed successfully:
1. Read the [User Guide](USER_GUIDE.md) for detailed usage instructions
2. Explore the library and try generating your first UI
3. Experiment with different prompts and patterns
4. Check out the example prompts in the composer