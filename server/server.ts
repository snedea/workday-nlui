import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { generateUI } from './llm';

config();

const app = express();
const PORT = process.env.PORT || 8787;

// Enhanced cookie store for Penpot session
interface CookieJar {
  [key: string]: {
    value: string;
    path?: string;
    domain?: string;
    expires?: string;
    maxAge?: number;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: string;
  };
}

let penpotCookieJar: CookieJar = {};

// Helper functions for cookie management
function parseCookieHeader(setCookieHeader: string): { name: string; cookie: CookieJar[string] } {
  const parts = setCookieHeader.split(';').map(part => part.trim());
  const [nameValue] = parts;
  const [name, value] = nameValue.split('=');

  const cookie: CookieJar[string] = { value };

  for (let i = 1; i < parts.length; i++) {
    const [key, val] = parts[i].split('=');
    const lowerKey = key.toLowerCase();

    switch (lowerKey) {
      case 'path':
        cookie.path = val;
        break;
      case 'domain':
        cookie.domain = val;
        break;
      case 'expires':
        cookie.expires = val;
        break;
      case 'max-age':
        cookie.maxAge = parseInt(val, 10);
        break;
      case 'httponly':
        cookie.httpOnly = true;
        break;
      case 'secure':
        cookie.secure = true;
        break;
      case 'samesite':
        cookie.sameSite = val;
        break;
    }
  }

  return { name, cookie };
}

function formatCookiesForRequest(): string {
  return Object.entries(penpotCookieJar)
    .map(([name, cookie]) => `${name}=${cookie.value}`)
    .join('; ');
}

app.use(cors());
app.use(express.json());

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required and must be a string' });
    }

    console.log('Generating UI for prompt:', prompt.substring(0, 100) + '...');

    const result = await generateUI(prompt);

    console.log('Generated UI successfully');
    res.json(result);

  } catch (error: any) {
    console.error('Generate API error:', error.message);

    if (error.message.includes('Invalid JSON schema')) {
      return res.status(400).json({ error: error.message });
    }

    if (error.message.includes('Authentication failed')) {
      return res.status(401).json({ error: error.message });
    }

    if (error.message.includes('Rate limit exceeded')) {
      return res.status(429).json({ error: error.message });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
});

// Penpot API proxy to handle CORS and authentication
app.post('/api/penpot/*', async (req, res) => {
  try {
    const endpoint = req.params[0];
    const penpotUrl = `http://localhost:9001/api/rpc/command/${endpoint}`;

    console.log('Proxying Penpot API call:', endpoint);

    // Forward cookies from the original request to Penpot
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    // Use stored Penpot cookies if available, otherwise try forwarding client cookies
    const storedCookies = formatCookiesForRequest();
    if (storedCookies) {
      headers['Cookie'] = storedCookies;
      console.log(`Using stored Penpot cookies for ${endpoint}: ${storedCookies.substring(0, 50)}...`);
    } else if (req.headers.cookie) {
      headers['Cookie'] = req.headers.cookie;
      console.log(`Forwarding client cookies for ${endpoint}`);
    }

    const response = await fetch(penpotUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(req.body || {})
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Penpot API error:', response.status, errorText);
      return res.status(response.status).json({ error: errorText });
    }

    // Handle response - some endpoints like login return empty body
    let data;
    const contentLength = response.headers.get('content-length');
    const contentType = response.headers.get('content-type');

    if (contentLength === '0' || (!contentType?.includes('json') && !contentType?.includes('transit'))) {
      // Empty response or non-JSON response (e.g., login endpoint)
      data = { success: true, message: 'Request completed successfully' };
      console.log(`${endpoint} completed with empty response - treating as success`);
    } else {
      // Parse JSON response
      data = await response.json();
    }

    // Handle Set-Cookie headers
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      // Forward to client
      res.setHeader('Set-Cookie', setCookieHeader);
      console.log(`Set-Cookie headers forwarded for ${endpoint}`);

      // Parse and store cookies for future requests
      const cookieStrings = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];

      for (const cookieStr of cookieStrings) {
        const { name, cookie } = parseCookieHeader(cookieStr);
        penpotCookieJar[name] = cookie;
        console.log(`Stored cookie: ${name}=${cookie.value.substring(0, 20)}...`);
      }

      if (endpoint === 'login') {
        console.log(`Login successful, stored ${Object.keys(penpotCookieJar).length} cookies`);
      }
    }

    res.json(data);

  } catch (error: any) {
    console.error('Penpot proxy error:', error.message);
    res.status(500).json({ error: 'Penpot API proxy failed' });
  }
});

app.get('/api/health', (req, res) => {
  const provider = process.env.OPENAI_PROVIDER || 'openai';
  const hasKey = provider === 'azure'
    ? !!process.env.AZURE_OPENAI_API_KEY
    : !!process.env.OPENAI_API_KEY;

  // Get model information based on provider
  const model = provider === 'azure'
    ? process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o-mini'
    : process.env.OPENAI_API_MODEL || 'gpt-4o-mini';

  res.json({
    status: 'ok',
    provider,
    model,
    configured: hasKey
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Provider: ${process.env.OPENAI_PROVIDER || 'openai'}`);
});