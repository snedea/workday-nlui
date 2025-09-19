import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { generateUI } from './llm';

config();

const app = express();
const PORT = process.env.PORT || 8787;

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

app.get('/api/health', (req, res) => {
  const provider = process.env.OPENAI_PROVIDER || 'openai';
  const hasKey = provider === 'azure'
    ? !!process.env.AZURE_OPENAI_API_KEY
    : !!process.env.OPENAI_API_KEY;

  res.json({
    status: 'ok',
    provider,
    configured: hasKey
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Provider: ${process.env.OPENAI_PROVIDER || 'openai'}`);
});