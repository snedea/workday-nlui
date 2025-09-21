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
           "Breadcrumbs" | "Footer" | "Checkbox" | "Radio" | "Switch" |
           "TextArea" | "Tooltip" | "Layout" | "Menu" | "Pagination" |
           "ColorPicker" | "SegmentedControl" | "Pill" | "Image" |
           "Timeline" | "Calendar" | "Chart" | "DatePicker" | "Map" |
           "Upload" | "Download" | "Scanner" | "Stepper" | "ProgressBar" |
           "Select" | "Preview" | "Points" | "Code",
  "props"?: { [key: string]: any },
  "children"?: UiNode[]
}

Guidelines:
- Use Workday-like terminology and structure.
- Prefer concise labels and Canvas-like props:
  - Button: { variant: "primary" | "secondary", text: string }
  - Field: { kind: "text" | "select" | "date" | "combobox", label: string, required?: boolean, readOnly?: boolean }
  - Badge: { status: string }
  - Tabs: children are Tab nodes with { label: string }
  - Table: { columns: string[], rows: Array<Record<string, string | UiNode | UiNode[]>> }
  - Avatar: { src?: string, name: string, size?: "sm" | "md" | "lg" | "xl", variant?: "circle" | "square" }
  - Card: { title?: string, image?: string }
  - Banner: { message: string, image?: string }
  - Pill: { label: string, variant?: "default" | "removable", color?: "blue" | "green" | "orange" | "red" | "gray" }
  - Image: { src: string, alt?: string, width?: string, height?: string }
  - Radio: { label: string, options: string[], value?: string, orientation?: "horizontal" | "vertical", required?: boolean, error?: string, hint?: string }
- For images in tables: Use the exact URLs provided by the user. If no URLs are provided, use emoji (🦸‍♂️) as fallback
- When asked for character images, use the exact URLs provided by the user, otherwise use emoji representations
- For Pills in table cells: Use UiNode format: {type: "Pill", props: {label: "Skill"}} or arrays for multiple Pills: [{type: "Pill", props: {label: "Skill1"}}, {type: "Pill", props: {label: "Skill2"}}]
- For radio buttons: Use {type: "Radio", props: {label: "Question", options: ["Option1", "Option2"], orientation?: "horizontal"}} instead of Field with kind: "radio"
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

      // Get configurable temperature (default 0.7)
      const temperature = parseFloat(process.env.OPENAI_TEMPERATURE || '0.7');

      // Detect different model types that require special handling
      const isO4Model = model.startsWith('o4-');
      const isO1Model = model.startsWith('o1-');
      const isReasoningModel = isO1Model || isO4Model;

      if (isReasoningModel) {
        // Reasoning models don't support system messages or response_format
        // Combine system prompt and user prompt into a single user message
        const combinedPrompt = `${SYSTEM_PROMPT}\n\nUser Request: ${prompt}`;

        if (isO4Model) {
          // o4 models use max_completion_tokens parameter
          response = await axios.post(url, {
            model,
            messages: [
              { role: 'user', content: combinedPrompt }
            ],
            temperature,
            max_completion_tokens: 2000
          }, {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            }
          });
        } else {
          // o1 models use max_tokens parameter
          response = await axios.post(url, {
            model,
            messages: [
              { role: 'user', content: combinedPrompt }
            ],
            temperature,
            max_tokens: 2000
          }, {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            }
          });
        }
      } else {
        // Standard models support system messages and response_format
        response = await axios.post(url, {
          model,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: prompt }
          ],
          response_format: { type: 'json_object' },
          temperature,
          max_tokens: 2000
        }, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        });
      }
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

    // Special error handling for reasoning models
    const model = process.env.OPENAI_API_MODEL || 'gpt-4o-mini';
    const isReasoningModel = model.startsWith('o1-') || model.startsWith('o4-');

    if (error.response?.status === 400 && isReasoningModel) {
      const errorMsg = error.response?.data?.error?.message || '';
      if (errorMsg.includes('response_format') || errorMsg.includes('system')) {
        throw new Error(`Reasoning model ${model} detected but API request failed. Please ensure you're using the latest version of NLUI Studio with reasoning model support.`);
      }
    }

    throw new Error(`LLM request failed: ${error.message}`);
  }
}