import axios from 'axios';
import { UiResponse } from './schema';

const SYSTEM_PROMPT = `You are a UI planning assistant. Output ONLY a JSON object that conforms to this Zod schema:

UiResponse = {
  "version": "1.0",
  "title": string,
  "tree": UiNode
}
UiNode = {
  "type": "Page" | "Header" | "Section" | "Card" | "Tabs" | "Tab" |
           "Table" | "Form" | "Field" | "Text" | "Badge" | "Button" |
           "Icon" | "Banner" | "Toast" | "Modal" | "Avatar" |
           "Breadcrumbs" | "Footer",
  "props"?: { [key: string]: any },
  "children"?: UiNode[]
}

Guidelines:
- Use Workday-like terminology and structure.
- Prefer concise labels and Canvas-like props:
  - Button: { variant: "primary" | "secondary", text: string }
  - Field: { kind: "text" | "select" | "date" | "combobox", label: string, required?: boolean, readOnly?: boolean }
  - Badge: { status: "Active" | "On Leave" | "Terminated" | "Draft" }
  - Tabs: children are Tab nodes with { label: string }
  - Table: { columns: string[], rows: Array<Record<string,string>> }
  - Avatar: { src?: string, name: string, size?: "sm" | "md" | "lg" | "xl", variant?: "circle" | "square" }
  - Card: { title?: string, image?: string }
  - Banner: { message: string, image?: string }
- For images in tables: Use the exact URLs provided by the user. If no URLs are provided, use emoji (🦸‍♂️) as fallback
- When asked for character images, use the exact URLs provided by the user, otherwise use emoji representations
- Avoid custom CSS or code. No markdown, no prose. JSON ONLY.`;

export async function generateUI(prompt: string): Promise<UiResponse> {
  const provider = process.env.OPENAI_PROVIDER || 'openai';

  try {
    let response;

    if (provider === 'azure') {
      const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
      const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
      const apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2024-02-15-preview';
      const apiKey = process.env.AZURE_OPENAI_API_KEY;

      if (!endpoint || !deployment || !apiKey) {
        throw new Error('Missing Azure OpenAI configuration');
      }

      const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

      response = await axios.post(url, {
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 2000
      }, {
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json'
        }
      });
    } else {
      const apiKey = process.env.OPENAI_API_KEY;
      const apiBase = process.env.OPENAI_API_BASE || 'https://api.openai.com/v1';
      const model = process.env.OPENAI_API_MODEL || 'gpt-4o-mini';

      if (!apiKey) {
        throw new Error('Missing OpenAI API key');
      }

      const url = `${apiBase}/chat/completions`;

      response = await axios.post(url, {
        model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 2000
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
    }

    const content = response.data.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content returned from LLM');
    }

    const jsonResponse = JSON.parse(content);
    return UiResponse.parse(jsonResponse);

  } catch (error: any) {
    console.error('LLM Error:', error.response?.data || error.message);

    if (error.name === 'ZodError') {
      throw new Error(`Invalid JSON schema: ${error.message}`);
    }

    if (error.response?.status === 401) {
      throw new Error('Authentication failed - check API keys');
    }

    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded - please try again later');
    }

    throw new Error(`LLM request failed: ${error.message}`);
  }
}